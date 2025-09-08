"use client";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  TrendingUp,
  Award,
  Shield,
  Crown,
} from "lucide-react";
import { formatNumber, formatPostTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import usePost from "@/hooks/usePost";
import PostCard from "@/components/post/PostCard";
import { Post } from "@/types/post";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/types/community";
import React, { useEffect, useState } from "react";
interface CommunityPageProps {
  params: Promise<{
    community: string;
  }>;
}

export function CommunityHeader({ community }: { community: Community | undefined }) {
if(community?.isLoading) {
  return <p>loading....</p>
}
  return (
    <div className="relative">
      <div
        className="h-48 bg-gradient-to-r from-primary to-secondary bg-cover bg-center"
        style={{ backgroundImage: `url(${community?.banner || ""})` }}
      />

      {/* Community Info Overlay */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-end gap-4 -mt-10 pb-4">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage
                src={community?.avatar || "/placeholder.svg"}
                alt={community?.communityName}
              />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {community?.communityName.charAt(2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-card-foreground truncate">
                  {community?.communityName}
                </h1>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(community?.membersCount)} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatPostTime(community?.createdAt)}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                {community?.description || ""}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={community?.isJoined ? "outline" : "default"}
                className="min-w-[100px]"
              >
                {community?.isJoined ? "Joined" : "Join"}
              </Button>
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

  const stats = [
    { label: "Posts Today", value: "127", icon: TrendingUp },
    { label: "Active Users", value: "2.3k", icon: Users },
    { label: "Community Rank", value: "#15", icon: Award },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Community Rules */}
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

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Community Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <stat.icon className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <span className="text-lg font-bold text-card-foreground">
                {stat.value}
              </span>
            </div>
          ))}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Community created on January 25, 2008
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CommunityMembers() {
  const members = [
    {
      id: 1,
      name: "TechModerator",
      avatar: "/tech-moderator.jpg",
      role: "moderator",
      isOnline: true,
    },
    {
      id: 2,
      name: "CodeWizard",
      avatar: "/code-wizard.jpg",
      role: "admin",
      isOnline: true,
    },
    {
      id: 3,
      name: "DevGuru",
      avatar: "/dev-guru.jpg",
      role: "member",
      isOnline: false,
    },
    {
      id: 4,
      name: "TechEnthusiast",
      avatar: "/tech-enthusiast.png",
      role: "member",
      isOnline: true,
    },
    {
      id: 5,
      name: "StartupFounder",
      avatar: "/startup-founder.png",
      role: "member",
      isOnline: false,
    },
    {
      id: 6,
      name: "AIResearcher",
      avatar: "/ai-researcher.jpg",
      role: "member",
      isOnline: true,
    },
  ];

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">
          Active Members
        </h2>
        <Badge variant="outline" className="text-xs">
          {members.filter((m) => m.isOnline).length} online
        </Badge>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center min-w-[80px] group"
          >
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                <AvatarImage
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                />
                <AvatarFallback className="text-sm bg-muted text-muted-foreground">
                  {member.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Online Status */}
              {member.isOnline && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-accent rounded-full border-2 border-background" />
              )}

              {/* Role Badge */}
              {member.role !== "member" && (
                <div className="absolute -top-1 -right-1">
                  {member.role === "admin" ? (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Shield className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              )}
            </div>

            <span className="text-xs text-muted-foreground mt-2 text-center truncate w-full">
              {member.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommunityPosts({ community }: { community: Community | undefined }) {
  const { fetchAllPost } = usePost();
  const allPosts = fetchAllPost.data || [];
  const [posts, setPosts] = useState([]); 

  useEffect(() => {
    if (community && allPosts.length > 0) {
      const communityId = community.id;

      const filteredPosts = allPosts.filter(
        (post:Post) => post.community.id === communityId
      );

      setPosts(filteredPosts);
    }
  }, [community, allPosts]);

  if ( fetchAllPost.isLoading) {
    return <div>Loading...</div>;
  }
  console.log("post", posts);
  if (posts.isLoading) {
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
        <select className="text-sm bg-input border border-border rounded-md px-3 py-1 text-foreground">
          <option>Hot</option>
          <option>New</option>
          <option>Top</option>
        </select>
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

  if(isLoading) {
    return <p>Loading...</p>
  }
  return (
    <div className="min-h-screen bg-background">
      <CommunityHeader community={communityData} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <CommunityMembers />
        <CommunityPosts  community={communityData} />
        <CommunityInfo />
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
