import { makeRequest } from "./makeRequest";

export async function getPosts() {
  return await makeRequest("/posts");
}

export async function getPost(id) {
  return await makeRequest(`/posts/${id}`);
}