"use client";

import { useEffect, useState } from "react";
import {
  MessageCircle,
  Share,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Vote from "@/components/vote";
import type { User } from "@/types/user";
import type { Comment, Post } from "@/types/post";
import { buildCommentTree, formatPostTime } from "@/lib/utils";
import useComment from "@/hooks/useComment";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useSaved from "@/hooks/useSaved";

export interface SavedComment {
  commentId: string;
  id: string;
  userId: string;

  comments: {
    id: string;
    body: string;
    createdAt: string;
    commentById: string;
    postId: string;
    updatedAt: string;
  };
}

export default function PostDetail({
  post,
  user,
}: {
  post: Post;
  user: User | null;
}) {
  const { savedComment, fetchSavedComment } = useSaved();
  const [savedCommentIds, setSavedCommentIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (fetchSavedComment.data) {
      const commentIds = fetchSavedComment.data.map(
        (saved: SavedComment) => saved.commentId
      );

      setSavedCommentIds(new Set(commentIds));
    }
  }, [fetchSavedComment.data]);
  console.log("commentIds", fetchSavedComment.data);
  // Update saved state when a comment is saved/unsaved
  useEffect(() => {
    if (savedComment.isSuccess && savedComment.data) {
      const commentId = savedComment.variables; // The comment ID passed to the mutation
      setSavedCommentIds((prev) => {
        const newSet = new Set(prev);
        if (savedComment.data.action === "saved") {
          newSet.add(commentId);
        } else {
          newSet.delete(commentId);
        }
        return newSet;
      });
    }
  }, [savedComment, savedComment.data]);

  const { createComment } = useComment();
  const [newComment, setNewComment] = useState<string>("");
  const [comments] = useState<Comment[]>(
    buildCommentTree(
      (post.comments || []).map((c) => ({ ...c, replies: c.replies || [] }))
    )
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#comment-")) {
      const commentId = hash.replace("#comment-", "");
      const element = document.getElementById(`comment-${commentId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          element.classList.add("highlight-comment");
          setTimeout(() => element.classList.remove("highlight-comment"), 3000);
        }, 100);
      }
    }
  }, []);

  const toggleCollapse = (commentId: string) => {
    setCollapsedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const data = {
      postId: post.id,
      body: newComment,
    };
    createComment.mutate(data);
    setNewComment("");
  };

  const addReply = (parentCommentId: string) => {
    if (!replyText.trim()) return;

    createComment.mutate({
      postId: post.id,
      body: replyText,
      parentId: parentCommentId,
    });

    setReplyText("");
    setReplyingTo(null);
  };
  const handleSaveComment = (commentId: string) => {
    if (!user) return;

    savedComment.mutate(commentId);
  };

  const isCommentSaved = (commentId: string) => {
    return savedCommentIds.has(commentId);
  };
  const renderComment = (comment: Comment, depth = 0) => {
    const isReplying = replyingTo === comment.id;
    const isCollapsed = collapsedComments.has(comment.id);
    const isSaved = isCommentSaved(comment.id);
console.log("commetn",comment)
    return (
      <div
        key={comment.id}
        id={`comment-${comment.id}`}
        className={`${
          depth > 0 ? "ml-6 border-l border-border/40 relative" : ""
        } scroll-mt-20`}
      >
        <Accordion
          type="single"
          collapsible
          value={isCollapsed ? "" : comment.id}
        >
          <AccordionItem value={comment.id} className="border-none">
            <div className="flex items-start gap-3 text-sm mb-3 relative">
              {depth > 0 && (
                <AccordionTrigger
                  onClick={() => toggleCollapse(comment.id)}
                  className="absolute -left-6 top-0 p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border-none hover:no-underline h-auto w-auto z-10"
                  style={{ transform: "translateX(-2px)" }}
                ></AccordionTrigger>
              )}

              {depth === 0 && (
                <AccordionTrigger
                  onClick={() => toggleCollapse(comment.id)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border-none hover:no-underline h-auto w-auto mt-0.5"
                ></AccordionTrigger>
              )}

              <div
                className={`flex items-center gap-3 flex-1 ${
                  depth > 0 ? "pl-4" : ""
                }`}
              >
                <Avatar>
                  <AvatarImage
                    src={comment.author.avatar || "/default-avatar.png"}
                    alt={comment.author.username || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                    {comment.author.username?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                <span className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
                  u/{comment.author.username}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {formatPostTime(comment.createdAt)}
                </span>
              </div>
            </div>

            <AccordionContent className="pb-0 pt-0">
              <div className={`space-y-3 ${depth > 0 ? "pl-4" : "pl-10"}`}>
                <p className="text-sm text-foreground leading-relaxed">
                  {comment.body}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Vote post={post} voteTo="comment" />
                  </div>
                  <button
                    onClick={() =>
                      setReplyingTo(isReplying ? null : comment.id)
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                  >
                    Reply
                  </button>
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                    Share
                  </button>
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                    Report
                  </button>
                  <button
                    onClick={() => handleSaveComment(comment.id)}
                    disabled={savedComment.isPending}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isSaved
                        ? "text-blue-400 bg-accent/10"
                        : "text-muted-foreground hover:text-zinc-800 hover:bg-accent/10"
                    } `}
                  >
                    <Bookmark
                      size={14}
                      className={isSaved ? "fill-current" : ""}
                    />
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>

                {isReplying && user && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                    <textarea
                      id="commentInput"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      rows={3}
                      placeholder="Write your reply..."
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => addReply(comment.id)}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="px-4 py-2 text-muted-foreground text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {comment.replies?.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {comment.replies.map((reply) =>
                      renderComment(reply, depth + 1)
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <span className="text-primary hover:underline cursor-pointer font-medium">
                r/{post.community.communityName}
              </span>
              <span>•</span>
              <span>Posted by</span>
              <span className="text-primary hover:underline cursor-pointer font-medium">
                u/{post.author.username}
              </span>
              <span>{formatPostTime(post.updatedAt)}</span>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-4 text-balance">
              {post.title}
            </h1>

            {post.content && (
              <div className="text-sm text-foreground mb-6 leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{ __html: post?.content.html }}
                  className="prose prose-sm max-w-none dark:prose-invert"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Vote post={post} voteTo="post" />
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
                onClick={() => router.push("#commentInput")}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments.length} Comments</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium">
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {user && (
          <div className="mb-6">
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="text-sm text-muted-foreground mb-3">
                Comment as{" "}
                <span className="text-primary font-medium">
                  u/{user.username}
                </span>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-4 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                rows={4}
                placeholder="What are your thoughts?"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={addComment}
                  disabled={createComment.isPending || !newComment.trim()}
                  className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createComment.isPending ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            {post.comments.length} Comments
          </h2>
          <div className="space-y-6">
            {comments
              .filter((comment) => comment.parentId === null)
              .map((comment) => renderComment(comment))}
          </div>
        </div>
      </div>
    </div>
  );
}
