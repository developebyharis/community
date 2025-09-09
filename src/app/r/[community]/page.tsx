"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { formatNumber, formatPostTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import usePost from "@/hooks/usePost";
import PostCard from "@/components/post/PostCard";
import { Post } from "@/types/post";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/types/community";
import React, { useEffect, useState } from "react";
import JoinCommunityBtn from "@/components/community/JoinCommunityBtn";
interface CommunityPageProps {
  params: Promise<{
    community: string;
  }>;
}

export function CommunityHeader({
  community,
}: {
  community: Community | undefined;
}) {
  if (!community) {
    return;
  }
  return (
    <div className="relative">
      <div
        className="h-48 bg-gradient-to-r from-primary to-secondary bg-cover rounded-lg bg-center"
        style={{
          backgroundImage: `url(${"/banner.jpg"})`,
        }}
      />

      <div className="backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-end gap-4 -mt-10 pb-4">
            <Avatar className="h-20 w-20 border-1 border-background shadow-md ">
              <AvatarImage
                src={community?.avatar || "/placeholder.svg"}
                alt={community?.communityName}
              />
              <AvatarFallback className="text-2xl font-bold bg-transparent">
                r/{community?.communityName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-card-foreground truncate">
                  r/{community?.communityName}
                </h1>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(community?.membersCount)} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created {formatPostTime(community?.createdAt as string)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                {community?.description || ""}
              </p>
            </div>

            <div className="flex gap-2">
              <JoinCommunityBtn community={community} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommunityInfo() {
  const rules = [
    "Be respectful and civil in discussions",
    "No spam or self-promotion without permission",
    "Stay on topic - technology related content only",
    "Use descriptive titles for your posts",
    "No duplicate posts - search before posting",
  ];

  return (
    <div className="grid md:grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Calendar className="h-5 w-5" />
            Community Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-start gap-3">
              <Badge
                variant="outline"
                className="min-w-[24px] h-6 flex items-center justify-center text-xs"
              >
                {index + 1}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function CommunityPosts({
  community,
}: {
  community: Community | undefined;
}) {
  const { fetchAllPost } = usePost();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = fetchAllPost.data || [];

    if (community && allPosts.length > 0) {
      const communityId = community.id;

      const filteredPosts = allPosts.filter(
        (post: Post) => post.community.id === communityId
      );

      setPosts(filteredPosts);
    }
  }, [community, fetchAllPost.data]);

  if (fetchAllPost.isLoading) {
    return <div>Loading...</div>;
  }
  console.log("post", posts);
  if (fetchAllPost.isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Recent Posts</h2>
      </div>

      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { community } = React.use(params);
  const { fetchAllCommunity } = useCommunity();
  const { data: communities = [], isLoading } = fetchAllCommunity;
  const communityData: Community | undefined = communities?.find(
    (c: Community) => c.communityName === community
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="px-4">
      <CommunityHeader community={communityData} />

      <div className="container px-4 py-6 space-y-6">
        <CommunityPosts community={communityData} />
        <CommunityInfo />
      </div>
    </div>
  );
}
