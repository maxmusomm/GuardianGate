"use client";

import React from "react";

import Header from "@/components/signIn-signUp-header";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mx-auto mt-8 max-w-md">
        <Header />
        <SignIn />
      </div>
    </main>
  );
}
