"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { COMMUNITY_PREFIX } from "@/constants/CommunityPrefix";
import JoinCommunityBtn from "./JoinCommunityBtn";

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
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {community.description}
              </p>
            )}
          </div>

          <div className="flex justify-end items-start shrink-0">
            <JoinCommunityBtn community={community} />
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
  );
}
