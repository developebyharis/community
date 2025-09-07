"use client";

import React, { useState } from "react";
import { MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import { Post } from "@/types/post";
import { formatNumber, formatPostTime, slugifyTitle } from "@/lib/utils";
import Link from "next/link";
import Vote from "../vote";

export default function PostCard({ post }: { post: Post }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!post) return null;

  return (
    <div className="bg-white border-b border-gray-200 transition-colors duration-150">
      <div className="p-4 hover:bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          <span className="font-medium text-gray-700">
            r/{post?.community?.communityName}
          </span>
          <span>•</span>
          <span>{formatPostTime(post.updatedAt)}</span>
        </div>
        <Link
          href={`r/${post?.community?.communityName}/comments/${
            post.id
          }/${slugifyTitle(post.title)}`}
        >
          <h2 className="text-base font-medium text-gray-900 mb-3 leading-snug cursor-pointer hover:text-gray-700">
            {post.title}
          </h2>
        </Link>
        {post.content && (
          <div className="text-sm text-gray-600 mb-4 leading-relaxed">
            <div
              dangerouslySetInnerHTML={{ __html: post?.content.html }}
              className="prose max-w-none"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Vote post={post} voteTo="post" />

            <Link
              href={`r/${post?.community?.communityName}/comments/${
                post.id
              }/${slugifyTitle(post.title)}`}
            >
              <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                <MessageCircle size={14} />
                <span className="text-sm">
                  {formatNumber(post?.comments?.length || 0)}
                </span>
              </button>
            </Link>
          </div>

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
