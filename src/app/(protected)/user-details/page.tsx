"use client";

import React, { useEffect, useState } from "react";
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

export default function UserDetailsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [companyCountryCode, setCompanyCountryCode] = useState("+260");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [canceld, setCanceld] = useState(false);
  const [fetchedDbUser, setFetchedDbUser] = useState(false);

  useEffect(() => {
    // Fetch current DB user
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (json?.ok && json.user) {
          setName(json.user.teamLeaderName || "");
          setOrganisation(json.user.organisation || "");
          const full = json.user.companyNumber || "";
          if (full.includes(" ")) {
            const [code, ...rest] = full.split(" ");
            setCompanyCountryCode(code);
            setCompanyNumber(rest.join(" "));
          } else {
            setCompanyNumber(full);
          }
          setFetchedDbUser(true);
        }
      })
      .catch((err) => console.error(err));
  }, []);

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
      company_number:
        companyCountryCode.trim() +
        (companyNumber.trim() ? " " + companyNumber.trim() : ""),
    };

    fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const json = await res.json();
        setSubmitting(false);
        if (!res.ok) {
          setError(json.error || "Update failed");
        } else {
          setSuccess("Saved.");
          router.push("/check-in");
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
            <CardTitle>Your details</CardTitle>
            <CardDescription>
              Update your account details below.
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
                  disabled={!fetchedDbUser}
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
                  disabled={!fetchedDbUser}
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
                    disabled={!fetchedDbUser}
                    onChange={(e) => setCompanyCountryCode(e.target.value)}
                  />
                  <Input
                    placeholder="977 7777"
                    value={companyNumber}
                    disabled={!fetchedDbUser}
                    onChange={(e) => setCompanyNumber(e.target.value)}
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
                  <Button
                    type="submit"
                    disabled={submitting || !fetchedDbUser || canceld}
                  >
                    {submitting ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setCanceld(true);
                      router.push("/check-in");
                    }}
                    disabled={submitting || !fetchedDbUser || canceld}
                    className="bg-red-700 hover:bg-red-900"
                  >
                    <p>Cancel</p>
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
