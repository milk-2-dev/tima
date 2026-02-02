import { useState, useEffect } from "react";
import { Link } from "react-router";
import { User, LogOut, Settings, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(null);
    setIsLoading(false);
  }, []);

  const createPageUrl = (page: string) => {
    switch (page) {
      case "Profile":
        return "/profile";
      case "Settings":
        return "/settings";
      default:
        return "/";
    }
  };

  const handleLogin = () => {};

  const handleLogout = () => {};

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={"/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">Tima</span>
          </Link>

          {/* Navigation */}
          {/* <nav className="hidden md:flex items-center gap-6">
            <Link
              to={"/events"}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Discover Events
            </Link>
          </nav> */}

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 bg-slate-100 rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="w-9 h-9 border-2 border-slate-100">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {user.full_name?.[0] ||
                          user.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium text-sm text-slate-900">
                      {user.full_name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={createPageUrl("Profile")}
                      className="cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={createPageUrl("Settings")}
                      className="cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleLogin}>
                  Log in
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleLogin}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
