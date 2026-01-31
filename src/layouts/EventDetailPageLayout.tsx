import { Outlet } from "react-router";

import Footer from "@/components/Footer";

export default function EventDetailPageLayout() {
  return (
    <div>
      {/* Main content */}
      <Outlet />

      <Footer />
    </div>
  );
}
