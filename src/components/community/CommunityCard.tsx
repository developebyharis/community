"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, UserMinus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Community {
  id: string;
  communityName: string;
  description: string;
  followers?: {
    followers: number;
  };
}

interface CommunityCardProps {
  community: Community;
  onFollow?: (communityId: string, isFollowing: boolean) => void;
  isFollowing?: boolean;

}

export default function CommunityCard({ 
  community, 
  onFollow, 
  isFollowing = false 
}: CommunityCardProps) {
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking follow button
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const newFollowingState = !isFollowingState;
      setIsFollowingState(newFollowingState);
      
      if (onFollow) {
         onFollow(community.id, newFollowingState);
      }
    } catch (error) {
      // Revert state on error
      setIsFollowingState(isFollowingState);
      console.error('Failed to follow/unfollow community:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Link
            href={`/community/${community.communityName}`}
            className="text-xl font-semibold hover:underline"
          >
            r/{community.communityName}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {community.description}
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href={`/community/${community.communityName}`}>
            <Button variant="outline">
              View
            </Button>
          </Link>
          
          <Button
            variant={isFollowingState ? "default" : "outline"}
            onClick={handleFollowClick}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <>
                {isFollowingState ? (
                  <>
                    <UserMinus size={16} className="mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    Follow
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users size={16} />
        <span>{community?.followers.length || 0} followers</span>
      </CardContent>
    </Card>
  );
}