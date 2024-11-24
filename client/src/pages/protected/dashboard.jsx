
import { Header } from "../../components/header"
import { MetricCards } from "../../components/metric-cards";
import { RecentOrders } from "../../components/recent-orders";
import { Appointments } from "../../components/appointments";
import { Sidebar } from "../../components/sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="container mx-auto p-4 space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <MetricCards />
          <div className="grid gap-6 md:grid-cols-2">
            <RecentOrders />
            <Appointments />
          </div>
        </main>
      </div>
    </div>
  );
}

