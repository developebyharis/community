"use client";

import { useState } from "react";
import {
  Home,
  TrendingUp,
  Users,
  Star,
  Clock,
  ChevronDown,
  Settings,
  HelpCircle,
  Shield,
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
import CreateCommunityDialog from "./community/CreateCommunity";
import useCommunity from "@/hooks/useCommunity";
import CommunityAvatar from "./community/CommunityAvatar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { COMMUNITY_PREFIX } from "@/constants/CommunityPrefix";

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

const otherItems = [
  { title: "User Settings", url: "#", icon: Settings },
  { title: "Help", url: "#", icon: HelpCircle },
  { title: "Reddit Coins", url: "#", icon: Star },
  { title: "Reddit Premium", url: "#", icon: Shield },
];

export function AppSidebar() {
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const { fetchMyFollowedCommunity } = useCommunity();
  const router = useRouter()



  const communities = fetchMyFollowedCommunity.data;
  console.log("eget", communities);
  if (!communities) return <p>loading..</p>;
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
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-100 rounded-md"
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 text-sm"
                    >
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {item.title}
                      </span>
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
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-100 rounded-md"
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 text-sm"
                    >
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {item.title}
                      </span>
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
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showAllCommunities ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Create Community Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-gray-100 rounded-md"
                >
                  <CreateCommunityDialog />
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Community List */}
              {communities
                .slice(0, showAllCommunities ? communities.length : 5)
                .map((community: any) => (
                  <SidebarMenuItem key={community.name}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-gray-100 rounded-md p-4"
                    >
                      <a
                        href={`${COMMUNITY_PREFIX}${community.communityName}`}
                        className="flex items-center gap-3 px-3 py-2 text-sm"
                      >
                        <CommunityAvatar name={community.communityName} />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900 block truncate">
                            {community.communityName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {community.followers.length || "0"} members
                          </span>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
{communities.length > 0 && (
                <SidebarMenuItem>
                  <Button 
                    onClick={() => router.push('/communities')} 
                    variant="ghost"
                    className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 h-auto py-2.5"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    View All Communities
                  </Button>
                </SidebarMenuItem>
              )}            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other Section */}
        <SidebarGroup className="px-4 border-t border-gray-200 pt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-100 rounded-md"
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 text-sm"
                    >
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {item.title}
                      </span>
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
