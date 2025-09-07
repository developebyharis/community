"use client";

import usePost from "@/hooks/usePost";
import PostCard from "./PostCard";
import { Post } from "@/types/post";

export default function CleanFeed() {

  const { fetchAllPost } = usePost();
  console.log("post", fetchAllPost.data);
  const posts = fetchAllPost.data || [];
  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/30">
        <h1 className="font-semibold text-gray-900">Popular</h1>
      </div>

      <div>
        {posts?.map((post: Post, index: number) => (
          <div key={index} className=" p-2">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
