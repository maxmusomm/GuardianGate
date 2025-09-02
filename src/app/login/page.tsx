"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Header } from "@/components/header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    setError(null);
    if (!email.trim()) return "Email is required";
    // basic email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    return null;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    // No backend wired — simulate success for UI purposes
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(
        "Logged in (mock). Replace with real auth logic to complete flow."
      );
    }, 700);
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Header />

      <div className="mx-auto mt-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign in to GuardianGate</CardTitle>
            <CardDescription>
              Use your email and password to sign in. This page currently
              contains client-side UI only.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password*
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <CardFooter>
                <div className="flex w-full items-center justify-between gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Signing in…" : "Sign in"}
                  </Button>

                  <Link
                    href="/signup"
                    className="text-sm text-muted-foreground"
                  >
                    Create an account
                  </Link>
                </div>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
