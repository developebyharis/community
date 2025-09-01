export interface Post {
  title: string;
  content?: string;  
  subreddit: string;
  timeAgo: string;
  votes: number;
  commentCount: number;
}
