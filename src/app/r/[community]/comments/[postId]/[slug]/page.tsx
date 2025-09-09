"use client"
import { useParams } from "next/navigation"
import { useFetchProfile } from "@/hooks/UseProfile"
import PostDetail from "@/components/post/PostDetail"
import usePost from "@/hooks/usePost"
import type { Post } from "@/types/post"

type PageParams = {
  community: string
  postId: string
  slug: string
}

export default function Page() {
  // Use useParams hook instead of props
  const params = useParams() as PageParams
  const { user, isLoading: userLoading } = useFetchProfile()
  const { fetchAllPost } = usePost()
  
  const posts = fetchAllPost.data || []
  
  if (userLoading) {
    return <p>user loading...</p>
  }
  
  const post: Post | undefined = posts.find((p: Post) => p.id === params.postId)
  
  if (!post) {
    return <p className="text-gray-600">Post not found</p>
  }
  
  return (
    <div>
      <PostDetail post={post} user={user} />
    </div>
  )
}