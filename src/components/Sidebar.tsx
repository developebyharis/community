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
  Loader2,
  Plus,
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
const feedItems = [{ title: "Home", url: "/", icon: Home },{ title: "Saved", url: "#", icon: Star }];


const otherItems = [
  { title: "User Settings", url: "/settings", icon: Settings },
  { title: "Help", url: "#", icon: HelpCircle },
];

// Community skeleton loader
const CommunitySkeleton = () => (
  <div className="flex items-center gap-3 px-3 py-2">
    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
    </div>
  </div>
);

export function AppSidebar() {
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const { fetchMyCommunities } = useCommunity();
  const router = useRouter();

  const {
    data: myCommunitiesData,
    isLoading: isLoadingCommunities,
    error: communitiesError,
  } = fetchMyCommunities;

  const communities = myCommunitiesData?.myFollowedCommunities?.data || [];
  const visibleCommunities = showAllCommunities
    ? communities
    : communities.slice(0, 5);

  return (
    <Sidebar className="lg:pt-16 md:pt-16 pt-14 bg-white border-r border-gray-200">
      <SidebarTrigger className="md:hidden" />

      <SidebarContent className="px-0">
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
                    className="hover:bg-gray-100 rounded-md transition-colors duration-150"
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

      

        <SidebarGroup className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Communities
            </SidebarGroupLabel>
            {communities.length > 5 && (
              <button
                onClick={() => setShowAllCommunities(!showAllCommunities)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showAllCommunities ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150"
                >
                  <CreateCommunityDialog />
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isLoadingCommunities && (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SidebarMenuItem key={`skeleton-${index}`}>
                      <CommunitySkeleton />
                    </SidebarMenuItem>
                  ))}
                </>
              )}

              {communitiesError && (
                <SidebarMenuItem>
                  <div className="px-3 py-2 text-sm text-red-600 text-center">
                    Failed to load communities
                  </div>
                </SidebarMenuItem>
              )}

              {!isLoadingCommunities && !communitiesError && (
                <>
                  {visibleCommunities.map((community: any) => (
                    <SidebarMenuItem key={community.id}>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-gray-100 rounded-md transition-colors duration-150"
                      >
                        <a
                          href={`${COMMUNITY_PREFIX}${community.communityName}`}
                          className="flex items-center gap-3 px-3 py-2 text-sm"
                        >
                          <CommunityAvatar name={community.communityName} />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-900 block truncate">
                              r/{community.communityName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {community.followers?.length || 0} members
                            </span>
                          </div>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {communities.length > 0 && (
                    <SidebarMenuItem>
                      <Button
                        onClick={() => router.push("/communities")}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 h-auto py-2.5 text-sm font-medium"
                      >
                        <Users className="w-4 h-4 mr-3" />
                        View All Communities
                        {communities.length > 5 && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {communities.length}
                          </span>
                        )}
                      </Button>
                    </SidebarMenuItem>
                  )}

                  {communities.length === 0 && !isLoadingCommunities && (
                    <SidebarMenuItem>
                      <div className="px-3 py-4 text-center">
                        <div className="text-sm text-gray-500 mb-2">
                          No communities yet
                        </div>
                        <Button
                          onClick={() => router.push("/communities")}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Discover Communities
                        </Button>
                      </div>
                    </SidebarMenuItem>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-4 border-t border-gray-200 pt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-100 rounded-md transition-colors duration-150"
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
