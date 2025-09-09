import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useClientSession } from "./UseProfile";
import { CreatePost, UpdatePost } from "@/types/post";

export default function usePost() {
  const session = useClientSession();

  const createPost = useMutation({
    mutationFn: async (values: CreatePost) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/me`,
        values,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      return res.data;
    },
  });
  const fetchMyPost = useQuery({
    queryKey: ["my-posts"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/me`,
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      );
      return response.data;
    },
    enabled: !!session?.accessToken,
    staleTime: 3 * 60 * 1000,
    retry: 1,
  });
  const fetchAllPost = useQuery({
    queryKey: ["all-posts"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post`
      );
      return response.data.data;
    },
    staleTime: 3 * 60 * 1000,
    retry: 1,
  });

  const updatePost = useMutation({
    mutationFn: async (values: UpdatePost) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/me/${values.postId}`,
        values,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      return res.data;
    },
  });
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/me/${id}`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      return res.data;
    },
  });
  return { createPost, fetchMyPost, fetchAllPost, updatePost, deletePost };
}
