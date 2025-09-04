"use client";

import useCommunity from "@/hooks/useCommunity";
import CommunityCard from "@/components/community/CommunityCard"; // Adjust path as needed
import { toast } from "sonner"; // or your toast library

export default function CommunitiesPage() {
  const { fetchAllCommunity, followCommunity } = useCommunity();
  
  console.log("fetchAllCommunity", fetchAllCommunity.data);

  if (fetchAllCommunity.isLoading) {
    return <div className="p-6">Loading communities...</div>;
  }

  if (fetchAllCommunity.error) {
    return <div className="p-6 text-red-500">Failed to load communities.</div>;
  }

  const communities = fetchAllCommunity.data || [];

  const handleFollowCommunity = async (communityId: string) => {
    try {
     

   followCommunity.mutate(communityId)



    } catch (error) {
      toast.error('Failed to update follow status');
      throw error; // Re-throw to trigger error handling in CommunityCard
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Communities</h1>

      <div className="grid gap-6">
        {communities.map((community: any) => (
          <CommunityCard
            key={community.id}
            community={community}
            onFollow={handleFollowCommunity}
          />
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No communities found.</p>
        </div>
      )}
    </div>
  );
}