import { makeRequest } from "./makeRequest";

export async function createComment({ postId, message, parentId }) {
  return await makeRequest(`/comments`, {
    method: "POST",
    data: { postId, message, parentId },
  });
}

export async function updateComment({ message, commentId }) {
  return await makeRequest(`/comments/${commentId}`, {
    method: "PUT",
    data: { message },
  });
}

export async function deleteComment(commentId) {
  return await makeRequest(`/comments/${commentId}`, {
    method: "DELETE",
  });
}

export async function likeComment(commentId) {
  return await makeRequest(`/comments/${commentId}/likes`, {
    method: "PUT",
  });
}