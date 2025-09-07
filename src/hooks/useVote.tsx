"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useClientSession } from "./UseProfile";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
type VoteData = {
  postId: string;
  value: number;
};
type commentData = {
  commentId: string;
  value: number;
};
export default function useVote() {
  const session = useClientSession();
  const queryClient = useQueryClient();

  const authHeader = {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  };

  const votePost = useMutation({
    mutationFn: async (data: VoteData) => {
      const res = await axios.post(
        `${API_URL}/vote/post`,
        { data },
        authHeader
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to vote on post: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  const voteComment = useMutation({
    mutationFn: async (data: commentData) => {
      const res = await axios.post(
        `${API_URL}/vote/comment`,
        { data },
        authHeader
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to vote on comment: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  return {
    votePost,
    voteComment,
  };
}
