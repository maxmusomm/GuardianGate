"use client";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const json = await res.json();
        if (json?.ok && !cancelled) setOrgName(json.user?.organisation ?? null);
      } catch (err) {
        console.log("Error fetching /api/auth/me", err);
      }
    }
    fetchMe();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            GuardianGate
          </h1>
          <p className="text-muted-foreground">{orgName}</p>
        </div>
      </div>
    </header>
  );
}
