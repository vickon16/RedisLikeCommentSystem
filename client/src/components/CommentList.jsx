import React, { useState, useMemo } from "react";
import { formatDistance } from "date-fns";
import IconButton from "./IconButton";
import {
  FaEdit,
  FaHeart,
  FaHeartBroken,
  FaReply,
  FaTrash,
} from "react-icons/fa";
import ReplyForm from "./ReplyForm";
import EditForm from "./EditForm";
import { deleteComment, likeComment } from "../services/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CommentList = ({ type, comments, getNestedReplies }) => {
  const queryClient = useQueryClient();
  const [childrenId, setChildrenId] = useState("");
  const [isReplying, setIsReplying] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [isLiked, setIsLiked] = useState("");
  const mutation = useMutation({
    mutationFn: (mutationData) => deleteComment(mutationData),
    onSuccess : () => queryClient.invalidateQueries({queryKey : ["posts"]})
  });

  const mutationLike = useMutation({
    mutationFn : (mutationData) => likeComment(mutationData),
    onSuccess : () => queryClient.invalidateQueries({queryKey : ["posts"]})
  })

  return comments?.map((comment) => {
    const { id, message, user, createdAt, postId, likes } = comment;
    const formatDate = formatDistance(new Date(createdAt), new Date(), {
      addSuffix: true,
    });

    const hasLiked = likes.includes(id)

    const handleLike = async () => {
      hasLiked ? setIsLiked("") : setIsLiked(id);
      mutationLike.mutate(id)
    };

    const toggleIsReplying = () =>
      isReplying === id ? setIsReplying("") : setIsReplying(id);

    const toggleIsEditing = () =>
      isEditing === id ? setIsEditing("") : setIsEditing(id);

    const nestedReplies = type === "root" && getNestedReplies(id);

    return (
      <div key={id}>
        <div className="my-3">
          <div className="comment p-2.5 border border-primaryBorder border-opacity-40 rounded">
            {/* header */}
            <div className="comment-header text-primaryText flex gap-2 mb-1 font-semibold max-w-sm">
              <span className="header-name font-bold text-lg">{user.name}</span>
              <span className="header-name font-light text-xs text-primaryText/90 self-end mb-1 italic">
                {formatDate}
              </span>
            </div>

            {/* message */}
            <div className="message whitespace-pre-wrap mx-2 my-2 text-primaryText">
              {message}
            </div>

            {/* footer */}
            <div className="footer flex gap-1 mt-1">
              <IconButton
                onClick={handleLike}
                Icon={FaHeart}
                disabled={mutationLike.isLoading}
                aria-label="Like"
                color={`${(hasLiked || isLiked === id )? "text-red-500" : ""}`}
              >
                {likes?.length}
              </IconButton>
              <IconButton
                Icon={FaReply}
                onClick={toggleIsReplying}
                aria-label={`${isReplying === id ? "Cancel" : "Reply"}`}
              />
              <IconButton
                Icon={FaEdit}
                onClick={toggleIsEditing}
                aria-label={`${isEditing === id ? "Cancel" : "Edit"}`}
              />
              <IconButton
                Icon={FaTrash}
                aria-label="Delete"
                disabled={mutation.isLoading}
                onClick={() => mutation.mutate(id)}
                color="text-red-500"
              />
            </div>

            {isReplying === id && (
              <div className="mt-1 ml-3">
                <ReplyForm postId={postId} parentId={id} autoFocus={true} />
              </div>
            )}

            {isEditing === id && (
              <div className="mt-1 ml-3">
                <EditForm
                  commentId={id}
                  defaultValue={message}
                  autoFocus={true}
                />
              </div>
            )}
          </div>

          {/* nested replies */}
          {nestedReplies !== null && nestedReplies.length > 0 && (
            <div className={`flex ${childrenId === id ? "hidden" : ""}`}>
              <button
                aria-label="hide replies"
                className="collapse-line"
                onClick={() => setChildrenId(id)}
              />
              <div className="pl-2 flex-grow">
                <CommentList comments={nestedReplies} />
              </div>
            </div>
          )}
        </div>
        {type === "root" && childrenId === id && (
          <button
            className={`bg-lightSecondaryText border-none outline-none cursor-pointer py-1 px-3 text-sm hover:bg-secondaryText transition rounded `}
            onClick={() => setChildrenId("")}
          >
            Show Replies
          </button>
        )}
      </div>
    );
  });
};

export default CommentList;
