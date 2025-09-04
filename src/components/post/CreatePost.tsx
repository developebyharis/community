"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import {
  Type,
  Link,
  ImageIcon,
  Hash,
  X,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Eye,
  Upload,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Community {
  name: string;
  members: string;
  icon: string;
}

interface ImageFile {
  id: number;
  url: string;
  file: File;
  name: string;
}

interface PostType {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const CreatePost = () => {
  const [postType, setPostType] = useState<string>("text");
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [nsfw, setNsfw] = useState<boolean>(false);
  const [spoiler, setSpoiler] = useState<boolean>(false);
  const [oc, setOc] = useState<boolean>(false);
  const [flair, setFlair] = useState<string>("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showFlairDropdown, setShowFlairDropdown] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const communities: Community[] = [
    { name: "todayilearned", members: "28.9M", icon: "🧠" },
    { name: "funny", members: "40.1M", icon: "😄" },
    { name: "pics", members: "29.2M", icon: "📸" },
    { name: "technology", members: "14.1M", icon: "💻" },
    { name: "askreddit", members: "35.4M", icon: "❓" },
    { name: "science", members: "28.3M", icon: "🔬" },
  ];

  const flairs: string[] = [
    "Discussion",
    "Question",
    "News",
    "Meme",
    "Tutorial",
    "Review",
    "Other",
  ];

  const postTypes: PostType[] = [
    { id: "text", label: "Text", icon: Type },
    { id: "link", label: "Link", icon: Link },
    { id: "image", label: "Image", icon: ImageIcon },
  ];

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        return isValidType && isValidSize;
      });

      const imageUrls: ImageFile[] = validFiles.map((file) => ({
        id: Math.random(),
        url: URL.createObjectURL(file),
        file,
        name: file.name,
      }));

      setImages((prev) => [...prev, ...imageUrls]);
    },
    []
  );

  const removeImage = useCallback((id: number) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const insertFormatting = useCallback(
    (format: string) => {
      const textarea = document.querySelector(
        'textarea[name="content"]'
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);

      let formattedText = "";
      let cursorOffset = 0;

      switch (format) {
        case "bold":
          formattedText = `**${selectedText}**`;
          cursorOffset = selectedText ? 0 : 2;
          break;
        case "italic":
          formattedText = `*${selectedText}*`;
          cursorOffset = selectedText ? 0 : 1;
          break;
        case "code":
          formattedText = `\`${selectedText}\``;
          cursorOffset = selectedText ? 0 : 1;
          break;
        case "quote":
          formattedText = `> ${selectedText}`;
          cursorOffset = selectedText ? 0 : 2;
          break;
        case "list":
          formattedText = `- ${selectedText}`;
          cursorOffset = selectedText ? 0 : 2;
          break;
        default:
          formattedText = selectedText;
      }

      const newContent =
        content.substring(0, start) + formattedText + content.substring(end);
      setContent(newContent);

      // Set cursor position after formatting
      setTimeout(() => {
        const newPosition =
          start + (selectedText ? formattedText.length : cursorOffset);
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }, 0);
    },
    [content]
  );

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Submitting post:", {
        type: postType,
        community: selectedCommunity,
        title,
        content,
        link,
        images,
        flags: { nsfw, spoiler, oc },
        flair,
      });

      // Reset form after successful submission
      setTitle("");
      setContent("");
      setLink("");
      setImages([]);
      setFlair("");
      setNsfw(false);
      setSpoiler(false);
      setOc(false);

      alert("Post submitted successfully!");
    } catch (error) {
      alert("Failed to submit post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = Boolean(
    title.trim() &&
      selectedCommunity &&
      (postType === "text"
        ? content.trim()
        : postType === "link"
        ? link.trim()
        : postType === "image"
        ? images.length > 0
        : true)
  );

  return (
    <div className="">
      <div className="max-w-5xl">
        <Card className="border-none shadow-none">
          <CardHeader className="">
            <CardTitle className="text-xl sm:text-2xl text-balance">
              Create a New Post
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 sm:p-6 space-y-6 sm:space-y-8">
            {/* Community Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Choose Community</Label>
              <Select
                value={selectedCommunity}
                onValueChange={setSelectedCommunity}
              >
                <SelectTrigger className="w-full h-14 sm:h-12">
                  <SelectValue placeholder="Select a community">
                    {selectedCommunity && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {
                            communities.find(
                              (c) => c.name === selectedCommunity
                            )?.icon
                          }
                        </span>
                        <div className="text-left">
                          <p className="font-semibold text-sm sm:text-base">
                            r/{selectedCommunity}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {
                              communities.find(
                                (c) => c.name === selectedCommunity
                              )?.members
                            }{" "}
                            members
                          </p>
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {communities.map((community) => (
                    <SelectItem
                      key={community.name}
                      value={community.name}
                      className="h-14 sm:h-12"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{community.icon}</span>
                        <div>
                          <p className="font-semibold text-sm sm:text-base">
                            r/{community.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {community.members} members
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Post Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Post Type</Label>
              <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 bg-muted rounded-xl">
                {postTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={postType === type.id ? "default" : "ghost"}
                    onClick={() => setPostType(type.id)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 h-12 sm:h-10 ${
                      postType === type.id ? "bg-background shadow-sm" : ""
                    }`}
                  >
                    <type.icon size={18} />
                    <span className="text-xs sm:text-sm">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Title</Label>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Write an engaging title..."
                  className="h-14 sm:h-12 text-base"
                  maxLength={300}
                  autoComplete="off"
                  autoCapitalize="sentences"
                />
                <div className="flex justify-between items-center text-sm">
                  <span
                    className={`${
                      title.length > 250
                        ? "text-orange-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {title.length}/300 characters
                  </span>
                  {title.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-green-600 bg-green-50 dark:bg-green-950/20"
                    >
                      <Check size={14} className="mr-1" />
                      <span className="hidden sm:inline">Good length</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content */}
            {postType === "text" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Content</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="h-10"
                  >
                    <Eye size={16} className="mr-2" />
                    {showPreview ? "Edit" : "Preview"}
                  </Button>
                </div>

                {!showPreview && (
                  <Card className="overflow-hidden">
                    <div className="flex items-center gap-1 p-2 sm:p-3 bg-muted border-b overflow-x-auto">
                      {[
                        { action: "bold", icon: Bold, title: "Bold" },
                        { action: "italic", icon: Italic, title: "Italic" },
                        { action: "code", icon: Code, title: "Code" },
                        { action: "quote", icon: Quote, title: "Quote" },
                        { action: "list", icon: List, title: "List" },
                      ].map(({ action, icon: Icon, title }) => (
                        <Button
                          key={action}
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting(action)}
                          className="min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto p-2"
                          title={title}
                        >
                          <Icon size={16} />
                        </Button>
                      ))}
                    </div>
                    <Textarea
                      name="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your thoughts, experiences, or ask a question..."
                      className="min-h-48 sm:min-h-40 border-0 focus-visible:ring-0 text-base leading-relaxed resize-y"
                      autoComplete="off"
                      autoCapitalize="sentences"
                      spellCheck="true"
                    />
                  </Card>
                )}

                {showPreview && (
                  <Card className="min-h-48 sm:min-h-40 p-4 sm:p-6 bg-muted/50">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {content ? (
                        <div className="whitespace-pre-wrap text-base leading-relaxed">
                          {content}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Nothing to preview yet...
                        </p>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Link Input */}
            {postType === "link" && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">URL</Label>
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  className="h-14 sm:h-12 text-base"
                  autoComplete="url"
                  inputMode="url"
                />
                {link && !link.match(/^https?:\/\/.+/) && (
                  <div className="flex items-center gap-1 text-sm text-orange-600">
                    <AlertCircle size={14} />
                    Please enter a valid URL starting with http:// or https://
                  </div>
                )}
              </div>
            )}

            {/* Image Upload */}
            {postType === "image" && (
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Images</Label>
                <Card className="border-2 border-dashed hover:border-primary/50 hover:bg-muted/50 transition-all duration-200">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-3 h-auto p-4 w-full"
                    >
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Upload size={24} className="text-primary" />
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-sm sm:text-base">
                          Upload images
                        </span>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 10MB each
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {images.map((image) => (
                      <Card
                        key={image.id}
                        className="relative group overflow-hidden"
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-24 sm:h-32 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <X size={12} />
                        </Button>
                        <div className="absolute bottom-1 left-1 right-1">
                          <Badge
                            variant="secondary"
                            className="text-xs truncate w-full justify-start bg-black/60 text-white border-0"
                          >
                            {image.name}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Post Options */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Post Options</Label>

              <div className="grid grid-cols-1 gap-4">
                {/* Flair Selection */}
                <div>
                  <Select value={flair} onValueChange={setFlair}>
                    <SelectTrigger className="w-full h-14 sm:h-12">
                      <SelectValue placeholder="Add flair">
                        {flair && (
                          <div className="flex items-center gap-2">
                            <Hash size={16} className="text-muted-foreground" />
                            <span className="font-medium">{flair}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {flairs.map((flairOption) => (
                        <SelectItem
                          key={flairOption}
                          value={flairOption}
                          className="h-12"
                        >
                          {flairOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Flags */}
                <Card className="p-4">
                  <Label className="text-sm font-medium mb-3 block">
                    Content Tags
                  </Label>
                  <div className="space-y-3">
                    {[
                      {
                        key: "nsfw",
                        label: "NSFW",
                        checked: nsfw,
                        setter: setNsfw,
                      },
                      {
                        key: "spoiler",
                        label: "Spoiler",
                        checked: spoiler,
                        setter: setSpoiler,
                      },
                      {
                        key: "oc",
                        label: "Original Content",
                        checked: oc,
                        setter: setOc,
                      },
                    ].map(({ key, label, checked, setter }) => (
                      <div key={key} className="flex items-center space-x-3">
                        <Checkbox
                          id={key}
                          checked={checked}
                          onCheckedChange={(checked) => setter(!!checked)}
                          className="h-5 w-5 sm:h-4 sm:w-4"
                        />
                        <Label
                          htmlFor={key}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Submit Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle size={16} className="text-primary flex-shrink-0" />
                <span>Remember to follow community guidelines</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 sm:h-10 bg-transparent"
                  disabled={isSubmitting}
                >
                  Save Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  className="w-full sm:w-auto h-12 sm:h-10"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
