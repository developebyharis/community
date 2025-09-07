"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, UserMinus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { COMMUNITY_PREFIX } from "@/constants/CommunityPrefix";
import useCommunity from "@/hooks/useCommunity";

interface Community {
  id: string;
  communityName: string;
  description: string;
  membersCount: number;
}

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  const { fetchMyCommunities, followCommunity, unfollowCommunity } =
    useCommunity();
  
  const [isFollowingState, setIsFollowingState] = useState(false);
  const [optimisticFollowing, setOptimisticFollowing] = useState<boolean | null>(null);

  // Check if user is following this community
  useEffect(() => {
    const followed =
      fetchMyCommunities?.data?.myFollowedCommunities?.data || [];
    const isFollowing = followed.some((c: any) => c.id === community.id);
    setIsFollowingState(isFollowing);
    
    // Reset optimistic state when real data loads
    if (optimisticFollowing !== null && !followCommunity.isPending && !unfollowCommunity.isPending) {
      setOptimisticFollowing(null);
    }
  }, [fetchMyCommunities.data, community.id, followCommunity.isPending, unfollowCommunity.isPending]);

  const displayFollowingState = optimisticFollowing !== null ? optimisticFollowing : isFollowingState;
  const isLoading = followCommunity.isPending || unfollowCommunity.isPending;

  const handleFollowClick = async () => {
    if (isLoading) return;

    try {
      if (displayFollowingState) {
        setOptimisticFollowing(false);
        await unfollowCommunity.mutateAsync(community.id);
      } else {
        setOptimisticFollowing(true);
        await followCommunity.mutateAsync(community.id);
      }
    } catch (err) {
      // Reset optimistic state on error
      setOptimisticFollowing(null);
      console.error("Failed to update follow status", err);
    }
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-gray-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link
              href={`/${COMMUNITY_PREFIX}${community.communityName}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-150 truncate block group-hover:text-blue-600"
            >
              r/{community.communityName}
            </Link>
            {community.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                {community.description}
              </p>
            )}
          </div>

          <div className="flex justify-end items-start shrink-0">
            <Button
              size="sm"
              variant={displayFollowingState ? "default" : "outline"}
              onClick={handleFollowClick}
              disabled={isLoading}
              className={`
                flex items-center justify-center px-4 py-2 text-sm min-w-[90px] h-9
                transition-all duration-150 font-medium
                ${displayFollowingState 
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                  : "border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-700"
                }
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : displayFollowingState ? (
                <>
                  <UserMinus size={14} className="mr-1.5" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus size={14} className="mr-1.5" />
                  Follow
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users size={16} className="text-gray-400" />
          <span>
            {community?.membersCount?.toLocaleString() || 0} 
            {community?.membersCount === 1 ? " member" : " members"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}