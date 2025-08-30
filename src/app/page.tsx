"use client";

import { useSession } from "next-auth/react";
import SignIn from "@/components/signin"

export default function Home() {
  const { data: session } = useSession();

  console.log("sess", session);

  return (
    <div className="p-4">
      <h1>Hello world testing backend</h1>
      
      {session ? (
        <div>
          <p>Welcome, {session.user?.name}</p>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
