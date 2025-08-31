"use client";

import { signOut } from "next-auth/react";
import SignIn from "@/components/signin";
import { useFetchProfile } from "@/hooks/UseProfile";

export default function Home() {
  const { user, loading } = useFetchProfile();

  console.log("user", user);

  if (loading) return <p>Loading...</p>;
  if (!user) console.log('User not found or deleted.');
  return (
    <div className="p-4">
      <h1>Hello world testing backend</h1>

      {user ? (
        <div>
          <p>Welcome, {user?.username}</p>
          <button onClick={() => signOut()}>Signout</button>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
