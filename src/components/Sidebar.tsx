"use client";

import { useState } from "react";
import { 
  Home, 
  TrendingUp, 
  Users, 
  Star, 
  Clock, 
  Plus,
  ChevronDown,
  Settings,
  HelpCircle,
  Shield
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Reddit-style menu items
const feedItems = [
  { title: "Home", url: "#", icon: Home },
  { title: "Popular", url: "#", icon: TrendingUp },
  { title: "All", url: "#", icon: Users },
];

const recentItems = [
  { title: "Recent Posts", url: "#", icon: Clock },
  { title: "Saved", url: "#", icon: Star },
];

const communities = [
  { name: "r/programming", members: "4.2M", icon: "💻" },
  { name: "r/webdev", members: "1.1M", icon: "🌐" },
  { name: "r/reactjs", members: "456K", icon: "⚛️" },
  { name: "r/javascript", members: "2.3M", icon: "🟨" },
  { name: "r/css", members: "234K", icon: "🎨" },
];

const otherItems = [
  { title: "User Settings", url: "#", icon: Settings },
  { title: "Help", url: "#", icon: HelpCircle },
  { title: "Reddit Coins", url: "#", icon: Star },
  { title: "Reddit Premium", url: "#", icon: Shield },
];

export function AppSidebar() {
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  
  return (
    <Sidebar className="lg:pt-16 md:pt-16 pt-14 bg-white border-r border-gray-200">
      <SidebarTrigger className="md:hidden" />

      <SidebarContent className="px-0">
        {/* Feeds Section */}
        <SidebarGroup className="px-4 pb-2">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Feeds
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {feedItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-gray-100 rounded-md">
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 text-sm">
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Section */}
        <SidebarGroup className="px-4 pb-2">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {recentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-gray-100 rounded-md">
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 text-sm">
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Communities Section */}
        <SidebarGroup className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Communities
            </SidebarGroupLabel>
            <button 
              onClick={() => setShowAllCommunities(!showAllCommunities)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllCommunities ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Create Community Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-gray-100 rounded-md">
                  <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm">
                    <Plus className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Create Community</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Community List */}
              {communities.slice(0, showAllCommunities ? communities.length : 5).map((community) => (
                <SidebarMenuItem key={community.name}>
                  <SidebarMenuButton asChild className="hover:bg-gray-100 rounded-md">
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm">
                      <span className="text-lg w-5 h-5 flex items-center justify-center text-center">
                        {community.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 block truncate">{community.name}</span>
                        <span className="text-xs text-gray-500">{community.members} members</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other Section */}
        <SidebarGroup className="px-4 border-t border-gray-200 pt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-gray-100 rounded-md">
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 text-sm">
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200 mt-auto">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Reddit, Inc. © 2024</div>
            <div>All rights reserved</div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}