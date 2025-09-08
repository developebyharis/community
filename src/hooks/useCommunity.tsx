"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useClientSession } from "./UseProfile";
import { toast } from "sonner";
import { createCommunityValues } from "@/lib/validations/community.schema";

export default function useCommunity() {
  const session = useClientSession();
  const queryClient = useQueryClient();

  const createCommunity = useMutation({
    mutationFn: async (data: createCommunityValues) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community/me`,
        data,
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["my-communities"] });
      toast.success(`Community "${data.name}" created successfully!`);
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create community: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  const fetchMyCommunities = useQuery({
    queryKey: ["my-communities", "my-followed-communities"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community/me`,
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      );
      return response.data;
    },
    enabled: !!session?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const fetchAllCommunity = useQuery({
    queryKey: ["all-communities"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community`
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  const followCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community/follow/${communityId}`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["my-communities"] });
      queryClient.invalidateQueries({ queryKey: ["all-communities"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to follow community: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  const unfollowCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community/unfollow/${communityId}`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["my-communities"] });
      queryClient.invalidateQueries({ queryKey: ["all-communities"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to unfollow community: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  return {
    createCommunity,
    fetchMyCommunities,
    fetchAllCommunity,
    followCommunity,
    unfollowCommunity,
  };
}