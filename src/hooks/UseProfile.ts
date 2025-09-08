"use client";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";
import { User } from "@/types/user";
import { toast } from "sonner";
import type { Session } from "next-auth";

type ExtendedSession = {
  accessToken?: string;
} & Session;

export function useClientSession() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  return session;
}

export function useFetchProfile() {
  const session = useClientSession();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-profile", session?.accessToken],
    queryFn: async (): Promise<User> => {
      const response = await axios.get<User>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!session?.accessToken,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    throwOnError: (error: any) => {
      if (error?.response?.status === 404) {
        toast.error("Profile not found. Please complete your profile setup.");
        return false;
      } else if (
        error?.response?.status !== 401 &&
        error?.response?.status !== 403
      ) {
        toast.error("Failed to load profile. Please try again.");
        return false;
      }
      return false;
    },
  });

  return {
    user: user || null,
    isLoading,
    error,
    refetch,
  };
}
