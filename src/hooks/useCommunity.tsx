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
      const res = axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community/me`,
        data,
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      );

      return toast.promise(res, {
        loading: "Creating community...",
        success: (res) => `${res.data.name} created successfully 🎉`,
        error: (err) =>
          `Failed to create community: ${
            err?.response?.data?.message || err.message
          }`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
const fetchMyCommunity = useQuery({ 
  queryKey: ["my-communities"], 
  queryFn: async () => { 
    try {
      const promise = axios.get( 
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community/me`, 
        { 
          headers: { Authorization: `Bearer ${session?.accessToken}` }, 
        } 
      ); 

      toast.promise(promise, { 
        loading: "Fetching my communities...", 
        success: (res) => { 
          return `Fetched ${res.data.length} communities 🎉`; 
        }, 
        error: (err) => { 
          return ( 
            err?.response?.data?.message || 
            err.message || 
            "Failed to fetch communities ❌" 
          ); 
        }, 
      });

      const response = await promise;
      return response.data.data; // Return the actual data
      
    } catch (error) {
      throw error; // React Query will handle this
    }
  }, 
}); 

const fetchAllCommunity = useQuery({ 
  queryKey: ["all-communities"], 
  queryFn: async () => { 
    try {
      const promise = axios.get( 
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community`
      ); 

      toast.promise(promise, { 
        loading: "Fetching all communities...", 
        success: (res) => { 
          return `Fetched ${res.data.length} communities 🎉`; 
        }, 
        error: (err) => { 
          return ( 
            err?.response?.data?.message || 
            err.message || 
            "Failed to fetch communities ❌" 
          ); 
        }, 
      });

      const response = await promise;
      return response.data.data;
      
    } catch (error) {
      throw error; 
    }
  }, 
});

const followCommunity = useMutation({
  mutationFn: async (communityId: string) => {
    const res = axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/community/follow/${communityId}`,
      {}, // no body
      {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      }
    );

    return toast.promise(res, {
      loading: "Following community...",
      success: (res) => `${res.data.message} 🎉`,
      error: (err) =>
        `Failed to follow community: ${
          err?.response?.data?.message || err.message
        }`,
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["communities"] });
    queryClient.invalidateQueries({ queryKey: ["followed-communities"] });
  },
});

const unfollowCommunity = useMutation({
  mutationFn: async (communityId: string) => {
    const res = axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/community/unfollow/${communityId}`,
      {}, // no body
      {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      }
    );

    return toast.promise(res, {
      loading: "Unfollowing community...",
      success: (res) => `${res.data.message} 🎉`,
      error: (err) =>
        `Failed to unfollow community: ${
          err?.response?.data?.message || err.message
        }`,
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["communities"] });
    queryClient.invalidateQueries({ queryKey: ["followed-communities"] });
  },
});


  return { createCommunity, fetchMyCommunity, fetchAllCommunity, followCommunity, unfollowCommunity};
}
