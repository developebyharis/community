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
  Settings,
  HelpCircle,
  LogOut,
  Loader2,
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
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isLoading } = useFetchProfile();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const UserAvatar = ({ className = "w-8 h-8" }: { className?: string }) => (
    <Avatar className={className}>
      <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
      <AvatarFallback className="bg-orange-500 text-white text-xs font-semibold">
        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );

  const LoadingAvatar = ({ className = "w-8 h-8" }: { className?: string }) => (
    <div className={`${className} bg-gray-200 rounded-full animate-pulse flex items-center justify-center`}>
      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0  z-50 bg-white border-b border-gray-200 md:flex lg:flex hidden">
        <div className="container mx-auto flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="p-2" />
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">r</span>
                </div>
                <span className="text-xl font-bold text-black">reddit</span>
              </button>
            </div>
          </div>

          <div className="flex-1 mx-6 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Reddit"
                className="w-full pl-12 pr-4 py-2.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 hover:bg-white transition-all duration-150"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 rounded-full px-4 py-2 font-medium"
              onClick={() => router.push("/submit")}
            >
              <Plus className="h-4 w-4" />
              Create
            </Button>

            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingAvatar />
                <div className="hidden sm:block">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto"
                  >
                    <UserAvatar />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {user.name || "User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        u/{user.username || "user"}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <div className="font-medium text-sm">{user.name || "User"}</div>
                    <div className="text-xs text-gray-500">u/{user.username || "user"}</div>
                  </div>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    User Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <HelpCircle className="h-4 w-4" />
                    Help Center
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignIn
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-colors duration-150"
                name="Sign In"
              />
            )}
          </div>
        </div>
      </header>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">r</span>
            </div>
            <span className="text-lg font-bold text-black">reddit</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={() => {
              // Toggle search modal on mobile
              console.log('Open search modal');
            }}
          >
            <Search className="h-5 w-5 text-gray-600" />
          </Button>

          {isLoading ? (
            <LoadingAvatar className="w-8 h-8" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 rounded-full">
                  <UserAvatar />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2 border-b">
                  <div className="font-medium text-sm truncate">{user.name || "User"}</div>
                  <div className="text-xs text-gray-500">u/{user.username || "user"}</div>
                </div>
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignIn
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-3 py-1.5 text-sm font-medium"
              name="Sign In"
            />
          )}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center py-2 px-2">
          <button
            onClick={() => {
              setActive("home");
              router.push('/');
            }}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 ${
              active === "home" 
                ? "text-orange-500 bg-orange-50" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium mt-1">Home</span>
          </button>

          <button
            onClick={() => {
              setActive("communities");
              router.push('/communities');
            }}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 ${
              active === "communities" 
                ? "text-orange-500 bg-orange-50" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs font-medium mt-1">Popular</span>
          </button>

          <div className="relative -mt-2">
            <Button
              size="icon"
              className="rounded-full w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-150"
              onClick={() => router.push("/submit")}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>

          <button
            onClick={() => {
              setActive("chat");
              // Navigate to chat
            }}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 relative ${
              active === "chat" 
                ? "text-orange-500 bg-orange-50" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs font-medium mt-1">Chat</span>
          </button>

          <button
            onClick={() => {
              setActive("inbox");
              // Navigate to inbox
            }}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-150 relative ${
              active === "inbox" 
                ? "text-orange-500 bg-orange-50" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs font-medium mt-1">Inbox</span>
          </button>
        </div>
      </nav>
    </>
  );
}