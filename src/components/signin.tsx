"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  const handleClick = async () => {
    await signIn("google");
  };

  return (
    <button
      className="bg-blue-400 px-4 py-2 rounded text-white"
      type="button"
      onClick={handleClick}
    >
      Sign in with Google
    </button>
  );
}
