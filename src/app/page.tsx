import { CheckInForm } from "@/components/check-in-form";
import { Header } from "@/components/header";
import { VisitorList } from "@/components/visitor-list";

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
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
