import fastify from "fastify";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

dotenv.config();

const app = fastify();
const PORT = process.env.PORT;
const prisma = new PrismaClient();
const CURRENT_USER_ID = (
  await prisma.user.findFirst({
    where: {
      name: "Kyle",
    },
  })
).id;

const includeComments = {
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

app.register(sensible);
app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
});
app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
});

// on every request, send cookie to the browser
app.addHook("onRequest", (req, res, done) => {
  if (req.cookies.userId !== CURRENT_USER_ID) {
    // for the server
    req.cookies.userId = CURRENT_USER_ID;
    // for the client
    res.clearCookie("userId");
    res.setCookie("userId", CURRENT_USER_ID);
  }

  done();
});

app.get("/posts", async (req, res) => {
  const posts = await commitToDB(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );

  return res.status(200).send(posts);
});

app.get("/posts/:id", async (req, res) => {
  const posts = await commitToDB(
    prisma.post.findUnique({
      where: { id: req.params?.id },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
          include: includeComments,
        },
      },
    })
  );

  return res.status(200).send(posts);
});

app.post("/comments", async (req, res) => {
  const { postId, message, parentId } = req.body;
  const userId = req.cookies.userId;

  if (!postId || !message) {
    return res.send(app.httpErrors.forbidden("Please, Provide details"));
  }

  let data = { message, userId, postId };
  if (parentId) data = { ...data, parentId };

  await commitToDB(prisma.comment.create({ data }));

  return res.status(200);
});

app.put("/comments/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const userId = req.cookies.userId;

  if (!message) {
    return res.send(app.httpErrors.forbidden("Please, Provide details"));
  }

  const currentComment = await prisma.comment.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (userId !== currentComment.userId) {
    return res.send(
      app.httpErrors.unauthorized(
        "You do not have permission to edit this message"
      )
    );
  }

  await commitToDB(
    prisma.comment.update({
      where: { id },
      data: { message },
    })
  );

  return res.status(200);
});

// like a comment
app.put("/comments/:id/likes", async (req, res) => {
  const { id } = req.params;
  const userId = req.cookies.userId;

  if (!userId) {
    app.httpErrors.unauthorized(
      "You do not have permission to like this comment"
    );
  }

  const {likes} = await prisma.comment.findFirst({
    where: { id },
    select: { likes: true },
  });

  const hasLiked = likes.includes(id);

  if (hasLiked) {
    await commitToDB(
      prisma.comment.update({
        where: { id },
        data: {
          likes: {
            set: likes.filter((otherId) => otherId !== id),
          },
        },
      })
    );
    return res.status(200).send("Disliked successfully");
  } else {
    await commitToDB(
      prisma.comment.update({
        where: { id },
        data: {
          likes: { push: id },
        },
      })
    );

    return res.status(200).send("Liked successfully");
  }
});

app.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.cookies.userId;

  const currentComment = await prisma.comment.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (userId !== currentComment.userId) {
    return res.send(
      app.httpErrors.unauthorized(
        "You do not have permission to delete this message"
      )
    );
  }

  console.log(currentComment.userId , userId);

  await commitToDB(prisma.comment.delete({ where: { id } }));
  return res.status(200);
});

async function commitToDB(promise) {
  const [error, data] = await app.to(promise);
  if (error) app.httpErrors.internalServerError(error.message);
  return data;
}

app.listen({ port: PORT }, () => console.log(`Listing on port ${PORT}`));
