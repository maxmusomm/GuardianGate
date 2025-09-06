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

export default function AddUserDetailsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [companyCountryCode, setCompanyCountryCode] = useState("+260");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      team_leader_name: name,
      organisation,
      company_number:
        companyCountryCode.trim() +
        (companyNumber.trim() ? " " + companyNumber.trim() : ""),
    };

    try {
      const res = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setSubmitting(false);
      if (!res.ok) {
        setError(json?.error || "Failed to create user");
        return;
      }
      router.push("/check-in");
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setError("Server error");
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Header />

      <div className="mx-auto mt-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Add your details</CardTitle>
            <CardDescription>
              Add your account details so your visitors can be linked to your
              organisation.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Team Leader Name
                </label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Organisation / Company
                </label>
                <Input
                  placeholder="GuardianGate Ltd"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Company number
                </label>
                <div className="flex gap-2">
                  <Input
                    className="w-28"
                    placeholder="+260"
                    value={companyCountryCode}
                    onChange={(e) => setCompanyCountryCode(e.target.value)}
                  />
                  <Input
                    placeholder="977 7777"
                    value={companyNumber}
                    onChange={(e) => setCompanyNumber(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Include country code (e.g. GB, US) in the left box.
                </p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <CardFooter>
                <div className="flex w-full items-center justify-center gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating…" : "Create"}
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
