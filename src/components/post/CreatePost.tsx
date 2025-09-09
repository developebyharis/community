 "use client";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useCommunity from "@/hooks/useCommunity";
import CommunityAvatar from "../community/CommunityAvatar";
import { PostFormValues, postSchema } from "@/lib/validations/post.schema";
import usePost from "@/hooks/usePost";
import { PostBodyData } from "@/types/post";
import { Community } from "@/types/community";
import { Editor as TinyMCEEditor } from 'tinymce';
import { CHARACTER_LIMIT } from "@/constants/CommunityPrefix";

export default function CreatePost() {
  const { fetchMyCommunities } = useCommunity();
  const { createPost } = usePost();

  const { data: myCommunitiesData, isLoading: isLoadingCommunities } =
    fetchMyCommunities;

  const communities = myCommunitiesData?.myFollowedCommunities?.data || [];
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      communityId: "",
      title: "",
      content: "",
    },
  });


  const onSubmit = (values: PostFormValues) => {
    const htmlContent = editorRef.current?.getContent() || "";
    const textContent = editorRef.current?.getContent({ format: "text" }) || "";

    // Validate content manually
    if (!textContent.trim()) {
      form.setError("content", {
        type: "manual",
        message: "Content is required",
      });
      return;
    }

    if (textContent.length > CHARACTER_LIMIT) {
      form.setError("content", {
        type: "manual",
        message: `Content exceeds ${CHARACTER_LIMIT} characters`,
      });
      return;
    }
    const bodyData: PostBodyData = {
      html: htmlContent,
      text: textContent,
    };

    const submitData = {
      communityId: values.communityId,
      title: values.title,
      content: bodyData,
    };
    createPost.mutate(submitData, {
      onSuccess: () => {
        form.reset();
        editorRef.current?.setContent("");
        window.location.reload();
      },
      onError: (error) => {
        console.error("Submission error:", error);
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto min-w-[768px] w-full p-4">
      <h1 className="text-lg font-semibold mb-6">Create a Post</h1>

      <Card className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="communityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose a community</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingCommunities}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community: Community) => (
                        <SelectItem key={community.id} value={community.id}>
                          <div className="flex items-center gap-2">
                            <CommunityAvatar name={community.communityName} />
                            <span>r/{community.communityName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...field}
                    placeholder="Enter post title"
                    maxLength={300}
                  />
                  <div className="flex justify-end text-xs text-gray-500">
                    {field.value?.length || 0}/300
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
                    value={field.value}
                    onEditorChange={(content) => {
                      field.onChange(content);
                      form.setValue("content", content, {
                        shouldValidate: true,
                      });
                    }}
                    onInit={(_, editor) => {
                      editorRef.current = editor;
                      if (field.value) {
                        editor.setContent(field.value);
                      }
                    }}
                    init={{
                      height: 600,
                      menubar: false,
                      branding: false,
                      plugins: ["autosave", "lists", "link"],
                      toolbar:
                        "formatselect | bold italic underline | " +
                        "alignleft aligncenter alignright | bullist numlist | " +
                        "link  ",
                      autosave_interval: "20s",
                      setup: (editor) => {
                        const syncContent = () => {
                          const content = editor.getContent();
                          field.onChange(content);
                          form.setValue("content", content, {
                            shouldValidate: false,
                            shouldDirty: true,
                          });
                        };

                        editor.on("change", syncContent);
                        editor.on("keyup", syncContent);
                        editor.on("blur", () => {
                          syncContent();
                          form.trigger("content");
                        });
                      },
                    }}
                  />
                  <div className="flex justify-end text-xs text-gray-500">
                    {editorRef.current
                      ? editorRef.current.getContent({ format: "text" })
                          ?.length || 0
                      : 0}
                    /3000
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                disabled={createPost.isPending}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>

            {createPost.isError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                <AlertCircle size={16} />
                {(createPost.error as Error).message}
              </div>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}
