"use client"

import type React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "./ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useFetchProfile } from "@/hooks/UseProfile"
import { signOut } from "next-auth/react"
import SignIn from "./signin"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [active, setActive] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isLoading } = useFetchProfile()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const UserAvatar = ({ className = "w-8 h-8" }: { className?: string }) => (
    <Avatar className={className}>
      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  )

  const LoadingAvatar = ({ className = "w-8 h-8" }: { className?: string }) => (
    <div className={`${className} bg-muted rounded-full animate-pulse flex items-center justify-center`}>
      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
    </div>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border md:flex lg:flex hidden">
        <div className="container mx-auto flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="p-1.5 hover:bg-muted rounded-md transition-colors" />
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">r</span>
              </div>
              <span className="text-xl font-bold text-foreground">reddit</span>
            </button>
          </div>

          <div className="flex-1 mx-6 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Reddit"
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-muted/50 hover:bg-muted transition-colors placeholder:text-muted-foreground"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-border hover:bg-muted rounded-full px-4 py-1.5 h-8 text-sm font-medium bg-transparent"
              onClick={() => router.push("/submit")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>

            {isLoading ? (
              <LoadingAvatar className="w-8 h-8" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted rounded-md px-2 py-1.5 h-8">
                    <UserAvatar className="w-6 h-6" />
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-md border-border">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="font-medium text-sm text-foreground">{user.name || "User"}</div>
                    <div className="text-xs text-muted-foreground">u/{user.username || "user"}</div>
                  </div>
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                    <User className="h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                    <Settings className="h-4 w-4" />
                    User Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                    <HelpCircle className="h-4 w-4" />
                    Help Center
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-destructive focus:text-destructive px-3 py-2"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignIn
                className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-full px-4 py-1.5 h-8 text-sm font-medium"
                name="Log In"
              />
            )}
          </div>
        </div>
      </header>

      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border flex items-center justify-between px-3 h-12 md:hidden">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="p-1.5 hover:bg-muted rounded-md transition-colors" />
          <button onClick={() => router.push("/")} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FF4500] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">r</span>
            </div>
            <span className="text-lg font-bold text-foreground">reddit</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-muted rounded-md"
            onClick={() => {
              console.log("Open search modal")
            }}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>

          {isLoading ? (
            <LoadingAvatar className="w-7 h-7" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1 rounded-full hover:bg-muted">
                  <UserAvatar className="w-7 h-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-md border-border">
                <div className="px-3 py-2 border-b border-border">
                  <div className="font-medium text-sm truncate text-foreground">{user.name || "User"}</div>
                  <div className="text-xs text-muted-foreground">u/{user.username || "user"}</div>
                </div>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-destructive focus:text-destructive px-3 py-2"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignIn
              className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-full px-3 py-1.5 h-7 text-sm font-medium"
              name="Log In"
            />
          )}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
        <div className="flex justify-around items-center h-12 px-2">
          <button
            onClick={() => {
              setActive("home")
              router.push("/")
            }}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-md transition-colors min-w-[48px] ${
              active === "home"
                ? "text-[#FF4500] bg-[#FF4500]/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Home className="h-5 w-5 mb-0.5" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => {
              setActive("communities")
              router.push("/communities")
            }}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-md transition-colors min-w-[48px] ${
              active === "communities"
                ? "text-[#FF4500] bg-[#FF4500]/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <TrendingUp className="h-5 w-5 mb-0.5" />
            <span className="text-xs font-medium">Popular</span>
          </button>

          <Button
            size="icon"
            className="rounded-full w-10 h-10 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white shadow-sm"
            onClick={() => router.push("/submit")}
          >
            <Plus className="h-5 w-5" />
          </Button>

          <button
            onClick={() => {
              setActive("chat")
            }}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-md transition-colors min-w-[48px] ${
              active === "chat"
                ? "text-[#FF4500] bg-[#FF4500]/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <MessageCircle className="h-5 w-5 mb-0.5" />
            <span className="text-xs font-medium">Chat</span>
          </button>

          <button
            onClick={() => {
              setActive("inbox")
            }}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-md transition-colors min-w-[48px] ${
              active === "inbox"
                ? "text-[#FF4500] bg-[#FF4500]/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Bell className="h-5 w-5 mb-0.5" />
            <span className="text-xs font-medium">Inbox</span>
          </button>
        </div>
      </nav>
    </>
  )
}
