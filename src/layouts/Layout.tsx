import { Outlet } from "react-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Layout() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main content */}
      <Outlet />

      <Footer />
    </div>
  );
}

export default Layout;
