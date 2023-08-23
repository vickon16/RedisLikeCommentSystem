import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "../services/posts";
import { FaSpinner } from "react-icons/fa";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

const Post = () => {
  const { id } = useParams();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    enabled: id !== null,
    queryKey: ["posts", { id }],
    queryFn: () => getPost(id),
  });

  const rootComments = useMemo(
    () => post?.comments?.filter((comment) => !comment.parentId) || [],
    [post?.comments]
  );

  const getNestedReplies = useCallback(
    (parentId) => {
      const rootComment = rootComments.find(
        (comment) => comment.id === parentId
      );
      const nestedReplies = post?.comments.filter(
        (comment) => comment.parentId === rootComment?.id
      );
      return nestedReplies || [];
    },
    [post?.comments, rootComments]
  );

  if (isLoading) {
    return (
      <h1 className="text-xl flex flex-col items-center gap-2 my-10">
        ...Loading... <FaSpinner className="animate-spin" />
      </h1>
    );
  }

  if (error || !post) {
    return <h1 className="text-rose-500">{error ?? "No post found"}</h1>;
  }

  return (
    <section className="flex flex-col gap-y-5">
      <h1 className="font-bold text-lg sm:text-xl md:text-2xl mt-10">
        {post.title}
      </h1>
      <article className="max-w-5xl text-gray-300 text-lg">{post.body}</article>

      <CommentForm postId={id} />
      <h3 className="mt-2 font-semibold text-gray-300 text-lg">Comments</h3>

      <section>
        {rootComments !== null && rootComments.length > 0 ? (
          <div className="my-4">
            <CommentList type="root" comments={rootComments} getNestedReplies={getNestedReplies} />
          </div>
        ) : (
          <div className="my-4">
            <h2 className="text-gray-400">...No comments to be displayed...</h2>
          </div>
        )}
      </section>
    </section>
  );
};

export default Post;
