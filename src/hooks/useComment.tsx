"use client";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useClientSession } from "./UseProfile";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useComment() {
  const session = useClientSession();
  const queryClient = useQueryClient();

  const authHeader = {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  };

  const createComment = useMutation({
    mutationFn: async (data: {
      body: string;
      postId: string;
      parentId?: string;
    }) => {
      const res = await axios.post(`${API_URL}/comment/me`, data, authHeader);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment created successfully!");
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create comment: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  const updateComment = useMutation({
    mutationFn: async (data: { id: string; body: string }) => {
      const res = await axios.patch(
        `${API_URL}/comment/${data.id}`,
        data,
        authHeader
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update comment: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${API_URL}/comment/${id}`, authHeader);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        `Failed to delete comment: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  const useComments = (postId: string) =>
    useQuery({
      queryKey: ["comments", postId],
      queryFn: async () => {
        const res = await axios.get(`${API_URL}/comment/post/${postId}`);
        return res.data;
      },
    });

  return {
    createComment,
    updateComment,
    deleteComment,
    useComments,
  };
}
