"use client";

import PostCard from "./PostCard";

export default function CleanFeed() {
  const posts = [
    {
      title: "TIL that octopuses have three hearts and blue blood",
      content:
        "The blue color comes from a copper-based protein called hemocyanin, which is more efficient than iron-based hemoglobin in cold environments.",
      subreddit: "todayilearned",
      timeAgo: "4h",
      votes: 1247,
      commentCount: 234,
    },
    {
      title: "My minimalist home office setup after 2 years of remote work",
      content:
        "Finally achieved the clean, distraction-free workspace I always wanted. Sometimes less really is more.",
      subreddit: "battlestations",
      timeAgo: "2h",
      votes: 892,
      commentCount: 156,
    },
    {
      title:
        "Scientists discover new method for carbon capture that's 99% more efficient",
      content:
        "This breakthrough could potentially reverse climate change within decades if scaled globally.",
      subreddit: "science",
      timeAgo: "6h",
      votes: 3421,
      commentCount: 89,
    },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/30">
        <h1 className="font-semibold text-gray-900">Popular</h1>
      </div>

      <div>
        {posts.map((post, index) => (
          <div key={index} className=" p-2">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
