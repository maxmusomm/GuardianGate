import { VisitorAnalytics } from "@/components/visitor-analytics";
import { Header } from "@/components/header";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main>
          <VisitorAnalytics />
        </main>
      </div>
    </div>
  );
}
