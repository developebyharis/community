"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import useVote from "@/hooks/useVote";
import { formatNumber } from "@/lib/utils";
import { useState } from "react";
import { Post } from "@/types/post";

export default function Vote({ post, voteTo }: { post: Post; voteTo: string }) {
    console.log("post",post)
  const [localVotes, setLocalVotes] = useState<number>(
    post?.votes?.length || 0
  );
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const { votePost, voteComment } = useVote();

  const handleVote = (voteType: "up" | "down") => {
    if (userVote === voteType) {
      setUserVote(null);
      setLocalVotes((prev) => prev + (voteType === "up" ? -1 : 1));
    } else if (userVote === null) {
      setUserVote(voteType);
      setLocalVotes((prev) => prev + (voteType === "up" ? 1 : -1));
    } else {
      setUserVote(voteType);
      setLocalVotes((prev) => prev + (voteType === "up" ? 2 : -2));
    }

    const value = voteType === "up" ? 1 : -1;
    if (voteTo === "comment") {
      const data = {
        commentId: post.id,
        value: value,
      };
      voteComment.mutate(data);
    } else if (voteTo === "post") {
      const data = {
        postId: post.id,
        value: value,
      };
      votePost.mutate(data);
    } else {
      return;
    }
  };

  return (
      <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-full">
        <button
          onClick={() => handleVote("up")}
          className={`p-1 rounded-full hover:bg-gray-300 transition-colors ${
            userVote === "up" ? "text-orange-500 bg-orange-50" : "text-gray-400"
          }`}
        >
          <ChevronUp size={16} />
        </button>

        <span
          className={`text-sm font-medium min-w-[12px] text-center ${
            userVote === "up"
              ? "text-orange-500"
              : userVote === "down"
              ? "text-blue-500"
              : "text-gray-600"
          }`}
        >
          {formatNumber(localVotes)}
        </span>

        <button
          onClick={() => handleVote("down")}
          className={`p-1 rounded-full hover:bg-gray-300 transition-colors ${
            userVote === "down" ? "text-blue-500 bg-blue-50" : "text-gray-400"
          }`}
        >
          <ChevronDown size={16} />
        </button>
      </div>
  );
}
