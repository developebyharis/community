"use client";

import { useState } from "react";
import { MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import Vote from "@/components/vote";
import { User } from "@/types/user";
import { Comment, Post } from "@/types/post";
import { buildCommentTree, formatPostTime } from "@/lib/utils";
import useComment from "@/hooks/useComment";
import { useRouter } from "next/navigation";

export default function PostDetail({
  post,
  user,
}: {
  post: Post;
  user: User | null;
}) {
  console.log("post", post);

  const { createComment } = useComment();
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>(
    buildCommentTree(
      (post.comments || []).map((c) => ({ ...c, replies: c.replies || [] }))
    )
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
const router = useRouter()
  const toggleCollapse = (commentId: string) => {
    const updateComment = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, isCollapsed: !comment.isCollapsed };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateComment(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments(updateComment(comments));
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const data = {
      postId: post.id,
      body: newComment,
    };
    console.log("Adding comment:", data);
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

  const renderComment = (comment: Comment, depth: number = 0) => {
    const isReplying = replyingTo === comment.id;

    return (
      <div
        key={comment.id}
        className={`${
          depth > 0 ? "ml-6 border-l border-gray-200 pl-4" : ""
        } space-y-2`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <img
            src={comment.author.avatar || "/default-avatar.png"}
            alt={comment.author.username}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-medium text-gray-700 hover:underline cursor-pointer">
            {comment.author.username}
          </span>
          <span>•</span>
          <span>{formatPostTime(comment.createdAt)}</span>
          <button
            onClick={() => toggleCollapse(comment.id)}
            className="ml-1 text-gray-400 hover:text-gray-600"
          >
            {comment.isCollapsed ? "+" : "−"}
          </button>
        </div>

        {/* Body */}
        {!comment.isCollapsed && (
          <div className="space-y-2">
            <p className="text-sm text-gray-800 leading-relaxed">
              {comment.body}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex flex-col items-center gap-1">
              <Vote post={post} voteTo="comment" />
            </div>
              <button
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                className="text-sm hover:text-blue-600 bg-zinc-100 rounded-full p-2"
              >
                Reply
              </button>
              <button className="text-sm hover:text-blue-600 bg-zinc-100 rounded-full p-2">Share</button>
              <button className="text-sm hover:text-blue-600 bg-zinc-100 rounded-full p-2">Report</button>
            </div>

            {/* Reply Input */}
            {isReplying && user && (
              <div className="mt-2">
                <textarea
                id="commentInput"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Write your reply..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => addReply(comment.id)}
                    disabled={!replyText.trim()}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                    className="px-3 py-1 text-gray-500 text-xs hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Nested replies */}
            {comment.replies?.length > 0 &&
              comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className=" bg-gray-50 ">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <div className="flex gap-4 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <button onClick={() => window.history.back()} className="rounded-full px-2 py-1 bg-gray-100 hover:bg-gray-200"> Back</button>
                <span className="hover:underline cursor-pointer">
                  r/{post.community.communityName}
                </span>
                <span>•</span>
                <span>Posted by</span>
                <span className="hover:underline cursor-pointer">
                  {post.author.username}
                </span>
                <span>{formatPostTime(post.updatedAt)}</span>
              </div>

              <h1 className="text-xl font-semibold text-gray-900 mb-3">
                {post.title}
              </h1>

              {post.content && (
                <div className="text-sm text-gray-800 mb-4 leading-relaxed whitespace-pre-line">
                  <div
                    dangerouslySetInnerHTML={{ __html: post?.content.html }}
                    className="prose max-w-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex flex-col items-center gap-1">
              <Vote post={post} voteTo="post" />
            </div>
                <button className="flex items-center gap-1 bg-zinc-100 rounded-full p-2 cursor-pointer" onClick={() => router.push('#commentInput')}>
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments.length} Comments</span>
                </button>
                <button className="flex items-center gap-1 hover:underline bg-zinc-100 rounded-full p-2">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-1 hover:underline bg-zinc-100 rounded-full p-2">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button className="flex items-center gap-1 hover:underline bg-zinc-100 rounded-full p-2">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {user && (
          <div className="mb-4 p-4">
            <div className="text-sm text-gray-600 mb-2">
              Comment as{" "}
              <span className="text-blue-600">u/{user.username}</span>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="What are your thoughts?"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={addComment}
                disabled={createComment.isPending || !newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createComment.isPending ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
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
