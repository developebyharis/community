"use client"

import usePost from "@/hooks/usePost"
import PostCard from "../post/PostCard"
import type { Post } from "@/types/post"

export default function CleanFeed() {
  const { fetchAllPost } = usePost()
  const posts = fetchAllPost.data || []

  return (
    /* Updated container with semantic tokens and improved layout */
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <h1 className="text-xl font-bold text-foreground">Popular Posts</h1>
        <p className="text-sm text-muted-foreground mt-1">Trending discussions in your communities</p>
      </div>

      <div className="space-y-4">
        {posts?.map((post: Post, index: number) => (
          <PostCard key={post.id || index} post={post} />
        ))}

        {posts?.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No posts available</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for new content</p>
          </div>
        )}
      </div>
    </div>
  )
}
