"use client";

import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  MessageSquare,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import useSaved from "@/hooks/useSaved";
import Link from "next/link";
import { SavedPost } from "@/types/post";



export interface SavedComment {
  id: string;
  comments: {
    id: string;
    body: string;
    createdAt: string;
    postId: string;
    post: {
      id: string;
      title: string;
    };
    commentBy: {
      id: string;
      username: string;
    };
  };
}

export default function SavedPage() {
  const { fetchSavedPost, fetchSavedComment } = useSaved();

  const savedPosts = (fetchSavedPost.data as SavedPost[]) || [];
  const savedComments = (fetchSavedComment.data as SavedComment[]) || [];

  const isLoading = fetchSavedPost.isLoading || fetchSavedComment.isLoading;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    console.log("tex", text);
    let output;
    if (text) {
      output =
        text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
    return output;
  };
  console.log("savedComments", savedComments);
  return (
    <div className=" bg-background">
      <header className="relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className=" px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-accent" />
              <h1 className="text-2xl font-bold text-balance">Saved Posts</h1>
            </div>
          </div>
        </div>
      </header>

      <main className=" px-4 py-8">
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-8">
            {savedPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Bookmark className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">Saved Posts</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPosts.map((savedPost) => (
                    <Card
                      key={savedPost.id}
                      className="group hover:shadow-lg transition-all duration-200 hover:border-accent/20"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-balance leading-tight group-hover:text-accent transition-colors">
                            {truncateText(savedPost.posts.title, 60)}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-xs"
                          >
                            {savedPost.posts.community.communityName}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(savedPost.posts.createdAt)}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {truncateText(savedPost.posts.content, 120)}
                        </p>

                        {savedPost.posts._count && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{savedPost.posts._count.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{savedPost.posts._count.votes}</span>
                            </div>
                          </div>
                        )}

                        <Button
                          size="sm"
                          className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                          asChild
                        >
                          <Link
                            href={`/r/${savedPost.posts.community.communityName}/comments/${savedPost.posts.id}/${savedPost.posts.title}`}
                          >
                            <ExternalLink className="h-3 w-3 mr-2" />
                            View Post
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {savedComments.length > 0 && (
              <>
                {savedPosts.length > 0 && <Separator className="my-8" />}

                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <MessageSquare className="h-5 w-5 text-accent" />
                    <h2 className="text-xl font-semibold">Saved Comments</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedComments.map((savedComment) => (
                      <Card
                        key={savedComment.id}
                        className="group hover:shadow-lg transition-all duration-200 hover:border-accent/20"
                      >
                        <CardHeader className="pb-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-balance leading-tight">
                              {truncateText(
                                savedComment.comments.post.title,
                                50
                              )}
                            </h3>
                            <Badge
                              variant="outline"
                              className="shrink-0 text-xs"
                            >
                              @{savedComment.comments.commentBy.username}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(savedComment.comments.createdAt)}
                          </p>
                        </CardHeader>

                        <CardContent className="">
                          <div className="bg-muted/50 p-3 rounded-lg mb-4">
                            <p className="text-sm leading-relaxed">
                              {truncateText(savedComment.comments.body, 150)}
                            </p>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full group-hover:border-accent group-hover:text-accent transition-colors bg-transparent"
                            asChild
                          >
                            <Link
                              href={`/r/community/comments/${savedComment.comments.postId}/${savedComment.comments.post.title}#comment-${savedComment.comments.id}`}
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              View Comment
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Empty State */}
            {savedPosts.length === 0 &&
              savedComments.length === 0 &&
              !isLoading && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                    <Bookmark className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No saved content yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto text-pretty">
                    Start saving posts and comments that you want to revisit
                    later. They&apos;ll appear here for easy access.
                  </p>
                  <Button asChild>
                    <Link href="/">Explore Posts</Link>
                  </Button>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}
