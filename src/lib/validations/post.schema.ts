import { z } from "zod";

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

export const postSchema = z.object({
  communityId: z.string().min(1, "Please select a community"),
  title: z.string().min(1, "Title is required").max(300, "Title must be less than 300 characters"),
  content: z
    .string()
    .refine((val) => {
      const textContent = stripHtmlTags(val);
      return textContent.length > 0;
    }, "Content is required")
    .refine((val) => {
      const textContent = stripHtmlTags(val);
      return textContent.length <= 3000;
    }, "Content must be less than 3000 characters")
});


// Type inference
export type PostFormValues = z.infer<typeof postSchema>;
