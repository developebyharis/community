"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SignIn({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await signIn("google");
    } catch (err) {
      toast.error("Something went wrong while signing in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        className
          ? className
          : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white flex items-center gap-2 rounded-full px-4 py-2 shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C34.5 33.1 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 
          12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.6 6.5 29.6 4 24 4 
          12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 
          19.6-20 0-1.3-.1-2.3-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 14 
          24 14c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.6 
          6.5 29.6 4 24 4c-7.7 0-14.2 4.3-17.7 
          10.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.6 0 10.6-1.8 14.1-4.9l-6.5-5.5C29.5 
          35.6 26.9 36 24 36c-5.7 0-10.5-2.9-13.3-7.2l-6.6 
          5.1C9.7 39.7 16.3 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-1.3 
          3.1-4.9 7-11.3 7-5.1 0-9.5-3.1-11.4-7.6l-6.6 
          5.1C9.5 37.1 16.2 42 24 42c11 0 19.6-8 
          19.6-20 0-1.3-.1-2.3-.4-3.5z"
        />
      </svg>
      <span className="font-medium">
        {loading ? "Signing in..." : name || "Sign in with Google"}
      </span>
    </button>
  );
}
