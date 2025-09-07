"use client"
import useCommunity from "@/hooks/useCommunity";
import CommunityCard from "@/components/community/CommunityCard";
import { Loader2, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommunityCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-6 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="w-20 h-9 bg-gray-200 rounded"></div>
    </div>
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Failed to load communities
    </h3>
    <p className="text-gray-600 mb-4 max-w-md">
      Something went wrong while fetching the communities. Please try again.
    </p>
    <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
      <Loader2 size={16} />
      Try Again
    </Button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No communities found
    </h3>
    <p className="text-gray-600 max-w-md">
      It looks like there aren&apos;t any communities available right now. 
      Check back later or try creating your own!
    </p>
  </div>
);

export  default function CommunitiesPage() {
  const { fetchAllCommunity } = useCommunity();

  const {
    data: communities = [],
    isLoading,
    error,
    refetch,
  } = fetchAllCommunity;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CommunityCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Communities
        </h1>
        <p className="text-gray-600">
          Find and join communities that match your interests
        </p>
        {communities.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {communities.length} {communities.length === 1 ? 'community' : 'communities'}
          </div>
        )}
      </div>

      {communities.length > 0 ? (
        <div className="grid gap-6">
          {communities.map((community: any) => (
            <CommunityCard
              key={community.id}
              community={community}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}