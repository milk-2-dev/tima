import { Outlet } from "react-router";
import { useState } from "react";
import { Grid, List, MapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

function Layout() {
  const [viewMode, setViewMode] = useState("grid");
  const [showMap, setShowMap] = useState(true);

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Thima</h1>
              <p className="text-slate-500 mt-1">Find sports events near you</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <Button
                variant={showMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="rounded-lg"
              >
                <MapIcon className="w-4 h-4 mr-2" />
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <Outlet />

      <Footer/>
    </div>
  );
}

export default Layout;
