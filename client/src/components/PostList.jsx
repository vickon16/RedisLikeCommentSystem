import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/posts";
import {FaSpinner} from "react-icons/fa"

const PostList = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) {
    return <h1 className="text-xl flex flex-col items-center gap-2 w-fit">...Loading... <FaSpinner className="animate-spin" /></h1>;
  }

  if (error) {
    return <h1 className="text-rose-500">{error}</h1>
  }


  return posts?.map((post) => (
    <h1 key={post.id} className="text-lg font-semibold underline underline-offset-4 tracking-wide mb-2">
      <a href={`/posts/${post.id}`}>{post.title}</a>
    </h1>
  ));
};

export default PostList;
