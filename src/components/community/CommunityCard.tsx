"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, UserMinus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { COMMUNITY_PREFIX } from "@/constants/CommunityPrefix";
import useCommunity from "@/hooks/useCommunity";

interface Community {
  id: string;
  communityName: string;
  description: string;
  followers?: any[];
}

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  const { fetchMyFollowedCommunity, followCommunity, unfollowCommunity } =
    useCommunity();

  const [isFollowingState, setIsFollowingState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update follow state when followed communities change
  useEffect(() => {
    const followed = fetchMyFollowedCommunity.data || [];
    setIsFollowingState(followed.some((c: any) => c.id === community.id));
  }, [fetchMyFollowedCommunity.data, community.id]);

  const handleFollowClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFollowingState) {
        await unfollowCommunity.mutateAsync(community.id);
      } else {
        await followCommunity.mutateAsync(community.id);
      }
    } catch (err) {
      console.error("Failed to update follow status", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="transition-transform hover:scale-[1.02] hover:shadow-lg duration-200">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/${COMMUNITY_PREFIX}${community.communityName}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 truncate block"
          >
            r/{community.communityName}
          </Link>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {community.description}
          </p>
        </div>

        {/* Follow/Unfollow button */}
        <div className="flex justify-end items-start">
          <Button
            size="sm"
            variant={isFollowingState ? "default" : "outline"}
            onClick={handleFollowClick}
            disabled={isLoading}
            className="flex items-center justify-center px-3 py-1 text-sm min-w-[75px] h-8"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : isFollowingState ? (
              <>
                <UserMinus size={14} className="mr-1" />
                Following
              </>
            ) : (
              <>
                <UserPlus size={14} className="mr-1" />
                Follow
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <Users size={16} />
        <span>{community.followers?.length || 0} followers</span>
      </CardContent>
    </Card>
  );
}
