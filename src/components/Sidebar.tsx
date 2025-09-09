"use client";

import { useState } from "react";
import {
  Home,
  Users,
  Star,
  ChevronDown,
  Settings,
  HelpCircle,
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
import Link from "next/link";
import { Community } from "@/types/community";

const feedItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Saved", url: "#", icon: Star },
];

const otherItems = [
  { title: "User Settings", url: "/settings", icon: Settings },
  { title: "Help", url: "#", icon: HelpCircle },
];

const CommunitySkeleton = () => (
  <div className="flex items-center gap-3 px-3 py-2">
    <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
    <div className="flex-1">
      <div className="h-3 bg-muted rounded w-24 mb-1 animate-pulse"></div>
      <div className="h-2 bg-muted rounded w-16 animate-pulse"></div>
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
    <Sidebar className="lg:pt-12 md:pt-12 pt-12 bg-background border-r border-border">
      <SidebarTrigger className="md:hidden" />

      <SidebarContent className="px-0">
        <SidebarGroup className="px-4 py-3 border-b border-border">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
            Feeds
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {feedItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-muted rounded-md transition-colors h-8 px-3"
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 text-sm"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-2 px-1">
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Communities
            </SidebarGroupLabel>
            {communities.length > 5 && (
              <button
                onClick={() => setShowAllCommunities(!showAllCommunities)}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted"
              >
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showAllCommunities ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-muted hover:text-[#FF4500] rounded-md transition-colors h-8 px-3"
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
                  <div className="px-3 py-2 text-xs text-destructive text-center rounded-md bg-destructive/10">
                    Failed to load communities
                  </div>
                </SidebarMenuItem>
              )}

              {!isLoadingCommunities && !communitiesError && (
                <>
                  {visibleCommunities.map((community: Community) => (
                    <SidebarMenuItem key={community.id}>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-muted rounded-md transition-colors h-auto py-2 px-3"
                      >
                        <Link
                          href={`/${COMMUNITY_PREFIX}${community.communityName}`}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                            <CommunityAvatar name={community.communityName} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-foreground block truncate text-sm">
                              r/{community.communityName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {community.followers?.length || 0} members
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {communities.length > 0 && (
                    <SidebarMenuItem>
                      <Button
                        onClick={() => router.push("/communities")}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start hover:bg-muted hover:text-[#FF4500] rounded-md transition-colors h-8 px-3 text-sm font-medium"
                      >
                        <Users className="w-4 h-4 mr-3" />
                        View All
                        {communities.length > 5 && (
                          <span className="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                            {communities.length}
                          </span>
                        )}
                      </Button>
                    </SidebarMenuItem>
                  )}

                  {communities.length === 0 && !isLoadingCommunities && (
                    <SidebarMenuItem>
                      <div className="px-3 py-4 text-center rounded-md bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-2">
                          No communities yet
                        </div>
                        <Button
                          onClick={() => router.push("/communities")}
                          variant="outline"
                          size="sm"
                          className="text-xs rounded-md border-border hover:bg-muted h-7"
                        >
                          Discover
                        </Button>
                      </div>
                    </SidebarMenuItem>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-4 py-3">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-muted rounded-md transition-colors h-8 px-3"
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 text-sm"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-3 border-t border-border mt-auto">
          <div className="text-xs text-muted-foreground text-center space-y-0.5">
            <div>Reddit, Inc. © 2024</div>
            <div>All rights reserved</div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
