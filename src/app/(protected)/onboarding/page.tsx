"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import Header from "@/components/header";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [companyCountryCode, setCompanyCountryCode] = useState("+260");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect to check-in if user already in DB

  function validate() {
    setError(null);

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
    const payload = {
      team_leader_name: name,
      organisation,
      company_number: companyCountryCode.trim() + " " + companyNumber.trim(),
    };

    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const json = await res.json();
        setSubmitting(false);
        if (!res.ok) {
          setError(json.error || "Signup failed");
        } else {
          setSuccess("Account created. All done.");
          // redirect to check-in route on success
          if (json.ok !== false) router.push("/check-in");
        }
      })
      .catch((err) => {
        console.error(err);
        setSubmitting(false);
        setError("Server error");
      });
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Header />

      <div className="mx-auto mt-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Almost there</CardTitle>
            <CardDescription>
              Just a few more details to set up your account.
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

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <CardFooter>
                <div className="flex w-full items-center justify-center gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating…" : "Finish up"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
