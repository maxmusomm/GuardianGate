import { CheckInForm } from "@/components/check-in-form";
import Header from "@/components/header";
import { VisitorList } from "@/components/visitor-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart2 } from "lucide-react";
import LogoutButton from "@/components/logout-button";

export default async function Home() {
  // Redirect to onboarding if user not in DB

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Header />
          <div className="flex items-center gap-2">
            <Link href="/user-details">
              <Button variant="ghost">User details</Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CheckInForm />
          </div>
          <div className="lg:col-span-2">
            <VisitorList />
          </div>
        </main>
      </div>
    </div>
  );
}
