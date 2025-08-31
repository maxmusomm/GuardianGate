import { ShieldCheck, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            GuardianGate
          </h1>
          <p className="text-muted-foreground">
            Modern Visitor Management System
          </p>
        </div>
      </div>
      <Link href="/analytics">
        <Button variant="outline">
          <BarChart2 className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </Link>
    </header>
  );
}
