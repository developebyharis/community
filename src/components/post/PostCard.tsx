"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import type { Post } from "@/types/post";
import { formatNumber, formatPostTime, slugifyTitle } from "@/lib/utils";
import Link from "next/link";
import Vote from "../vote";
import useSaved from "@/hooks/useSaved";

export default function PostCard({ post }: { post: Post }) {
  const { savedPost, fetchSavedPost } = useSaved();
  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect(() => {
    if (fetchSavedPost.data) {
      const savedPostIds = fetchSavedPost.data.map((p: any) => p.postId);
      const isPostSaved = savedPostIds.find((pId: string) => pId === post.id);
      setIsBookmarked(!!isPostSaved);
    }
  }, [fetchSavedPost.data, post.id]);

  if (!post) return null;

  const savedPostHandle = (postId: string) => {
    savedPost.mutate(postId);
  };
  return (
    <div className="bg-card border border-border rounded-lg transition-all duration-200 hover:shadow-md hover:border-accent/20">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href={`/r/${post?.community?.communityName}`}
            className="font-semibold text-foreground hover:text-accent transition-colors"
          >
            r/{post?.community?.communityName}
          </Link>
          <span className="text-border">•</span>
          <span>{formatPostTime(post.updatedAt)}</span>
        </div>

        <Link
          href={`r/${post?.community?.communityName}/comments/${
            post.id
          }/${slugifyTitle(post.title)}`}
          className="block group"
        >
          <h2 className="text-lg font-semibold text-foreground leading-tight group-hover:text-zinc-700 transition-colors duration-200 text-balance">
            {post.title}
          </h2>
        </Link>

        {post.content && (
          <div className="text-muted-foreground leading-relaxed">
            <div
              dangerouslySetInnerHTML={{ __html: post?.content.html }}
              className="prose prose-sm max-w-none prose-gray dark:prose-invert"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Vote post={post} voteTo="post" />

            <Link
              href={`r/${post?.community?.communityName}/comments/${
                post.id
              }/${slugifyTitle(post.title)}`}
            >
              <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/10 transition-colors text-muted-foreground hover:text-accent group">
                <MessageCircle
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-sm font-medium">
                  {formatNumber(post?.comments?.length || 0)}
                </span>
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-md hover:bg-accent/10 transition-colors text-muted-foreground hover:text-accent">
              <Share size={16} />
            </button>

            <button
              onClick={() => {
                setIsBookmarked(!isBookmarked);
                savedPostHandle(post.id);
              }}
              className={`p-2 rounded-md transition-colors ${
                isBookmarked
                  ? "text-blue-300 bg-accent/10"
                  : "text-muted-foreground hover:text-zinc-800 hover:bg-accent/10"
              }`}
            >
              <Bookmark
                size={16}
                className={isBookmarked ? "fill-current" : ""}
              />
            </button>

            <button className="p-2 rounded-md hover:bg-accent/10 transition-colors text-muted-foreground hover:text-accent">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
