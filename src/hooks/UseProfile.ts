"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function useFetchProfile() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        setUser(res.data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 404) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [session]);

  return { user, loading };
}
