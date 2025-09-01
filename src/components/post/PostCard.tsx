"use client";

import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Post } from "@/types/post";

export default function PostCard({ post }: { post: Post }) {
  const [votes, setVotes] = useState<number>(1247);
  const [userVote, setUserVote] = useState<string | null>(null); // null, 'up', or 'down'
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleVote = (voteType: string) => {
    if (userVote === voteType) {
      setUserVote(null);
      setVotes((prev) => (voteType === "up" ? prev - 1 : prev + 1));
    } else if (userVote === null) {
      setUserVote(voteType);
      setVotes((prev) => (voteType === "up" ? prev + 1 : prev - 1));
    } else {
      setUserVote(voteType);
      setVotes((prev) => (voteType === "up" ? prev + 2 : prev - 2));
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <div className="bg-white border-b border-gray-200 transition-colors duration-150">
      <div className="p-4 hover:bg-gray-100 rounded-xl">
        {/* Post Header - Simplified */}
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          <span className="font-medium text-gray-700">r/{post.subreddit}</span>
          <span>•</span>
          <span>{post.timeAgo}</span>
        </div>

        {/* Post Title - Cleaner typography */}
        <h2 className="text-base font-medium text-gray-900 mb-3 leading-snug cursor-pointer hover:text-gray-700">
          {post.title}
        </h2>

        {/* Post Content - More subtle */}
        {post.content && (
          <div className="text-sm text-gray-600 mb-4 leading-relaxed">
            <p>{post.content}</p>
          </div>
        )}

        {/* Actions Row - Minimal design */}
        <div className="flex items-center justify-between">
          {/* Left side - Vote and Comments */}
          <div className="flex items-center gap-4">
            {/* Voting - Inline design */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote("up")}
                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                  userVote === "up"
                    ? "text-orange-500 bg-orange-50"
                    : "text-gray-400"
                }`}
              >
                <ChevronUp size={16} />
              </button>

              <span
                className={`text-sm font-medium min-w-[32px] text-center ${
                  userVote === "up"
                    ? "text-orange-500"
                    : userVote === "down"
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                {formatNumber(votes)}
              </span>

              <button
                onClick={() => handleVote("down")}
                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                  userVote === "down"
                    ? "text-blue-500 bg-blue-50"
                    : "text-gray-400"
                }`}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Comments */}
            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <MessageCircle size={14} />
              <span className="text-sm">{formatNumber(post.commentCount)}</span>
            </button>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
              <Share size={14} />
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                isBookmarked ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <Bookmark
                size={14}
                className={isBookmarked ? "fill-current" : ""}
              />
            </button>

            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
