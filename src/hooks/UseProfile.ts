"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (!session?.accessToken) return;

    async function fetchProfile() {
      const profilePromise = axios.get<User>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      toast.promise(profilePromise, {
        loading: "Loading profile...",
        success: (res) => {
          setUser(res.data);
          return "Profile loaded successfully";
        },
        error: (err) => {
          console.error("Error fetching profile:", err);
          if (err.response?.status === 404) {
            setUser(null);
            return "Profile not found";
          }
          return "Failed to load profile";
        },
      });
    }

    fetchProfile();
  }, [session]);

  return { user };
}
