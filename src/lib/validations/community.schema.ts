import z from "zod";

export const createCommunitySchema = z.object({
  communityName: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(50, "Community name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Only letters, numbers, underscores, and hyphens are allowed",
    }),
  description: z
    .string()
    .min(10, "Description should be atleast 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  isPublic: z.boolean(),
  topics: z.array(z.string()).min(1, "Please select at least one topic"),
});

export type createCommunityValues = z.infer<typeof createCommunitySchema>;
