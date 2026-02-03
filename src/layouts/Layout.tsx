import { Outlet } from "react-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Layout() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="min-h-screen bg-slate-50">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
