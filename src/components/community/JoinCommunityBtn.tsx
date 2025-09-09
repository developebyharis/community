"use client";

import useCommunity from "@/hooks/useCommunity";
import { Community, FollowedCommunities } from "@/types/community";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, UserMinus, UserPlus } from "lucide-react";

export default function JoinCommunityBtn({
  community,
}: {
  community: Community | undefined;
}) {
  const { fetchMyCommunities, followCommunity, unfollowCommunity } =
    useCommunity();

  const [isFollowingState, setIsFollowingState] = useState(false);
  const [optimisticFollowing, setOptimisticFollowing] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const followed =
      fetchMyCommunities?.data?.myFollowedCommunities?.data || [];
    console.log("followed", followed);
    const isFollowing = followed.some(
      (c: FollowedCommunities) => c.id === community?.id
    );
    setIsFollowingState(isFollowing);

    // Reset optimistic state when real data loads
    if (
      optimisticFollowing !== null &&
      !followCommunity.isPending &&
      !unfollowCommunity.isPending
    ) {
      setOptimisticFollowing(null);
    }
  }, [
    fetchMyCommunities.data,
    community?.id,
    followCommunity.isPending,
    unfollowCommunity.isPending,
    optimisticFollowing,
  ]);

  const displayFollowingState =
    optimisticFollowing !== null ? optimisticFollowing : isFollowingState;
  const isLoading = followCommunity.isPending || unfollowCommunity.isPending;

  const handleFollowClick = async () => {
    if (isLoading) return;

    try {
      if (displayFollowingState) {
        setOptimisticFollowing(false);
        await unfollowCommunity.mutateAsync(community?.id as string);
      } else {
        setOptimisticFollowing(true);
        await followCommunity.mutateAsync(community?.id as string);
      }
    } catch (err) {
      setOptimisticFollowing(null);
      console.error("Failed to update follow status", err);
    }
  };

  return (
    <div>
      <Button
        size="sm"
        variant={displayFollowingState ? "destructive" : "default"}
        onClick={handleFollowClick}
        disabled={isLoading}
        className={`
                flex items-center justify-center px-4 py-2 text-sm min-w-[100px] h-9
                transition-all duration-200 font-medium
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
              `}
      >
        {isLoading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : displayFollowingState ? (
          <>
            <UserMinus size={14} className="mr-2" />
            Joined
          </>
        ) : (
          <>
            <UserPlus size={14} className="mr-2" />
            Join
          </>
        )}
      </Button>
    </div>
  );
}
