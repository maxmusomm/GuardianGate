"use client";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
    // OR manually:
    // await signOut();
    // router.push("/sign-in");
  };
  return (
    <Button variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  );
}
