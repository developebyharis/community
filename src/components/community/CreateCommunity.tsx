"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import useCommunity from "@/hooks/useCommunity";
import {
  createCommunitySchema,
  createCommunityValues,
} from "@/lib/validations/community.schema";
import { Plus } from "lucide-react";

const topicCategories: Record<string, string[]> = {
  Development: ["Web Development", "Mobile Development", "Backend", "Frontend"],
  "AI / Data": ["AI / ML", "Data Science", "Big Data"],
  "Cloud & DevOps": ["Cloud Computing", "DevOps", "Infrastructure"],
  Design: ["UI/UX Design", "Graphic Design"],
  Security: ["Cybersecurity", "Ethical Hacking"],
};

export default function CreateCommunityDialog() {
  const [open, setOpen] = React.useState(false);
  const { createCommunity } = useCommunity();

  const [step, setStep] = React.useState(1);

  const form = useForm<createCommunityValues>({
    resolver: zodResolver(createCommunitySchema),
    mode: "onChange",
    defaultValues: {
      communityName: "",
      description: "",
      isPublic: true,
      topics: [],
    },
  });

  const onSubmit = async (values: createCommunityValues) => {
    try {
      createCommunity.mutate(values);
      form.reset();
      setStep(1);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3 px-3 py-2 text-sm w-full">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create Community</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Community
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 mx-1 rounded-full ${
                step >= s ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 min-h-[260px] flex flex-col"
          >
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="communityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter community name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter community description"
                          className="resize-none"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <FormField
                control={form.control}
                name="topics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topics</FormLabel>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {Object.entries(topicCategories).map(
                        ([category, topics]) => (
                          <div key={category} className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700">
                              {category}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {topics.map((topic) => (
                                <label
                                  key={topic}
                                  className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-gray-50"
                                >
                                  <Checkbox
                                    checked={field.value?.includes(topic)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([
                                          ...(field.value || []),
                                          topic,
                                        ]);
                                      } else {
                                        field.onChange(
                                          field.value?.filter(
                                            (t) => t !== topic
                                          ) || []
                                        );
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{topic}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="mt-auto flex justify-between pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              ) : (
                <span />
              )}

              {step < 2 ? (
                <Button
                  type="button"
                  onClick={async () => {
                    let stepFields: (keyof createCommunityValues)[] = [];
                    if (step === 1)
                      stepFields = ["communityName", "description"];
                    if (step === 2) stepFields = ["topics"];

                    const valid = await form.trigger(stepFields);
                    if (valid) setStep((s) => s + 1);
                  }}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  Create
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
