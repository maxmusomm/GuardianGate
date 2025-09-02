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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [companyCountryCode, setCompanyCountryCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    setError(null);
    if (!email.trim()) return "Email is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
    // If a company number is provided, require an organisation name and country code
    if (companyNumber.trim() && !organisation.trim())
      return "Organisation / company name is required when providing a company number";
    if (companyNumber.trim() && !companyCountryCode.trim())
      return "Company country code is required when providing a company number";
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
    // No backend — mock the creation flow
    setTimeout(() => {
      setSubmitting(false);
      setSuccess("Account created (mock). Replace with real signup logic.");
    }, 900);
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Header />

      <div className="mx-auto mt-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Sign up with an email and password. This is a UI-only page — no
              backend is wired yet.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Team Leader Name*
                </label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Organisation / Company*
                </label>
                <Input
                  placeholder="GuardianGate Ltd"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Company number*
                </label>
                <div className="flex gap-2">
                  <Input
                    className="w-28"
                    placeholder="+260"
                    value={companyCountryCode}
                    onChange={(e) => setCompanyCountryCode(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="977 7777"
                    value={companyNumber}
                    onChange={(e) => setCompanyNumber(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Include country code (e.g. GB, US) in the left box.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Email*</label>
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirm password*
                </label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <CardFooter>
                <div className="flex w-full items-center justify-between gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating…" : "Create account"}
                  </Button>

                  <Link href="/login" className="text-sm text-muted-foreground">
                    Already have an account?
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
