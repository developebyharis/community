"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, UserMinus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { COMMUNITY_PREFIX } from "@/constants/CommunityPrefix"
import useCommunity from "@/hooks/useCommunity"

interface Community {
  id: string
  communityName: string
  description: string
  membersCount: number
}

interface CommunityCardProps {
  community: Community
}

export default function CommunityCard({ community }: CommunityCardProps) {
  const { fetchMyCommunities, followCommunity, unfollowCommunity } = useCommunity()

  const [isFollowingState, setIsFollowingState] = useState(false)
  const [optimisticFollowing, setOptimisticFollowing] = useState<boolean | null>(null)

  // Check if user is following this community
  useEffect(() => {
    const followed = fetchMyCommunities?.data?.myFollowedCommunities?.data || [];
    const isFollowing = followed.some((c: any) => c.id === community.id)
    setIsFollowingState(isFollowing)

    // Reset optimistic state when real data loads
    if (optimisticFollowing !== null && !followCommunity.isPending && !unfollowCommunity.isPending) {
      setOptimisticFollowing(null)
    }
  }, [fetchMyCommunities.data, community.id, followCommunity.isPending, unfollowCommunity.isPending])

  const displayFollowingState = optimisticFollowing !== null ? optimisticFollowing : isFollowingState
  const isLoading = followCommunity.isPending || unfollowCommunity.isPending

  const handleFollowClick = async () => {
    if (isLoading) return

    try {
      if (displayFollowingState) {
        setOptimisticFollowing(false)
        await unfollowCommunity.mutateAsync(community.id)
      } else {
        setOptimisticFollowing(true)
        await followCommunity.mutateAsync(community.id)
      }
    } catch (err) {
      // Reset optimistic state on error
      setOptimisticFollowing(null)
      console.error("Failed to update follow status", err)
    }
  }

  return (
    /* Updated card styling with semantic tokens and improved hover effects */
    <Card className="group transition-all duration-200 hover:shadow-lg border-border hover:border-accent/30 bg-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <Link
              href={`/${COMMUNITY_PREFIX}${community.communityName}`}
              className="text-xl font-bold text-foreground hover:text-accent transition-colors duration-200 truncate block group-hover:text-accent"
            >
              r/{community.communityName}
            </Link>
            {community.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{community.description}</p>
            )}
          </div>

          <div className="flex justify-end items-start shrink-0">
            <Button
              size="sm"
              variant={displayFollowingState ? "default" : "outline"}
              onClick={handleFollowClick}
              disabled={isLoading}
              className={`
                flex items-center justify-center px-4 py-2 text-sm min-w-[100px] h-9
                transition-all duration-200 font-medium
                ${
                  displayFollowingState
                    ? "bg-accent hover:bg-accent/90 text-accent-foreground border-accent"
                    : "border-border hover:border-accent hover:bg-accent/10 text-foreground hover:text-accent"
                }
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : displayFollowingState ? (
                <>
                  <UserMinus size={14} className="mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus size={14} className="mr-2" />
                  Follow
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={16} className="text-accent" />
          <span className="font-medium">
            {community?.membersCount?.toLocaleString() || 0}
            {community?.membersCount === 1 ? " member" : " members"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
