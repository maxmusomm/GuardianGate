import { VisitorAnalytics } from "@/components/visitor-analytics";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogoutButton from "@/components/logout-button";

export default function AnalyticsPage() {
  // Redirect to onboarding if user not in DB

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Header />
          <div className="flex items-center gap-2">
            <Link href="/check-in">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
        <main>
          <VisitorAnalytics />
        </main>
      </div>
    </div>
  );
}
