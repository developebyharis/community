"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useClientSession } from "./UseProfile";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useSaved() {
  const session = useClientSession();
  const queryClient = useQueryClient();

  const authHeader = {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  };

  const savedPost = useMutation({
    mutationFn: async (postId: string) => {
      const res = await axios.post(
        `${API_URL}/saved/post`,
        { postId },
        authHeader
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error:  AxiosError<{ message: string }>) => {
      toast.error(
        `Failed to vote on post: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

   const fetchSavedPost = useQuery({
    queryKey: ["my-saved-posts", session?.accessToken],
    queryFn: async () => {
      const res = await axios.get(
       `${API_URL}/saved/post`,
        authHeader
      );
      return res.data;
    },
    enabled: !!session?.accessToken,
    staleTime: 3 * 60 * 1000,
    retry: 1,
  });

  const savedComment = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await axios.post(
        `${API_URL}/saved/comment`,
        { commentId },
        authHeader
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error:  AxiosError<{ message: string }>) => {
      toast.error(
        `Failed to vote on comment: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

   const fetchSavedComment = useQuery({
      queryKey: ["my-saved-comments",session?.accessToken],
      queryFn: async () => {
        const res = await axios.get(
       `${API_URL}/saved/comment`,
        authHeader
      );
      return res.data;
    },
      enabled: !!session?.accessToken,
      staleTime: 3 * 60 * 1000,
      retry: 1,
    });

  return {
    savedPost,
    savedComment,fetchSavedPost,
    fetchSavedComment
  };
}
