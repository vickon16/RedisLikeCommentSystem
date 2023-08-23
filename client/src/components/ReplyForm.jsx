import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createComment } from "../services/comments";

const ReplyForm = ({ postId, parentId, autoFocus = false }) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  
  const { error, isLoading, mutate } = useMutation({
    mutationKey: ["create-reply"],
    mutationFn: (mutationData) => createComment(mutationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setMessage("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    mutate({ postId, parentId, message });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="flex gap-2 w-fit">
        <input
          autoFocus={autoFocus}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Create a comment"
          className="flex-grow px-3 py-2 rounded border border-primaryText focus-within:border-secondaryText bg-transparent text-sm"
        />
        <button
          disabled={!message}
          type="submit"
          className="self-start bg-lightSecondaryText border-none outline-none cursor-pointer px-3 py-2 hover:bg-secondaryText transition rounded disabled:bg-lightSecondaryText/30 disabled:cursor-not-allowed "
        >
          {isLoading ? "Replying..." : "Reply"}
        </button>
      </div>
      {error && <p className="text-rose-500 mt-1">{error}</p>}
    </form>
  );
};

export default ReplyForm;
