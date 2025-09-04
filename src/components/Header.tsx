"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  User,
  Home,
  Bell,
  MessageCircle,
  TrendingUp,
  ChevronDown,
  Coins,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useFetchProfile } from "@/hooks/UseProfile";
import { signOut } from "next-auth/react";
import SignIn from "./signin";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [active, setActive] = useState("home");
  const { user } = useFetchProfile();
  const router = useRouter();
  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm md:flex hidden">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo and Home */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />

              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">r</span>
              </div>
              <div className="text-xl font-bold text-black">reddit</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-4 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Reddit"
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1 rounded-full px-4"
              onClick={() => router.push("/submit")}
            >
              <Plus className="h-4 w-4" />
              Create
            </Button>

            <div className="flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-orange-500 text-white text-xs">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.name || "User"}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span> {user?.username || "User"}</span>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[12rem]">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>User Settings</DropdownMenuItem>
                    <DropdownMenuItem>Help Center</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Button
                        className="bg-transparent text-red-600 hover:bg-red-100 w-[9rem]"
                        onClick={() => signOut()}
                      >
                        Log Out
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <SignIn
                    className={
                      "bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 hover:from-blue-600 hover:via-yellow-600 hover:to-red-600 text-white flex items-center gap-2 rounded-full px-4 py-1 shadow-md transition-all duration-300"
                    }
                    name={"Signin"}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">r</span>
            </div>
            <div className="text-lg font-bold text-black">reddit</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-700">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-700 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-orange-500 text-white text-xs">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-around items-center py-2 md:hidden">
        <button
          onClick={() => setActive("home")}
          className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
            active === "home" ? "text-orange-500" : "text-gray-600"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => setActive("communities")}
          className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
            active === "communities" ? "text-orange-500" : "text-gray-600"
          }`}
        >
          <TrendingUp className="h-6 w-6" />
          <span className="text-xs font-medium">Communities</span>
        </button>

        <div className="relative -mt-4">
          <Button
            size="icon"
            className="rounded-full w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <button
          onClick={() => setActive("chat")}
          className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors relative ${
            active === "chat" ? "text-orange-500" : "text-gray-600"
          }`}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs font-medium">Chat</span>
          <span className="absolute -top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={() => setActive("inbox")}
          className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors relative ${
            active === "inbox" ? "text-orange-500" : "text-gray-600"
          }`}
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs font-medium">Inbox</span>
          <span className="absolute -top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </nav>
    </>
  );
}
