export interface CreatePost {
  communityId: string;
  title: string;
  content: PostBodyData;
}
export interface UpdatePost {
  postId: string;
  title: string;
  body: PostBodyData;
  updatedAt: string;
}
export interface Post {
  id: string;
  title: string;
  content: PostBodyData;
  updatedAt: string;
  author: User;
  community: Community;
  votes: Vote[];
  comments: Comment[];
}

export interface User {
  id: string;
  username: string;
  avatar: string | null;
}

export interface Community {
  id: string;
  communityName: string;
  description: string | null;
}

export interface Vote {
  id: string;
  value: number; // assuming +1 / -1
  userId: string;
}

export interface Comment {
  id: string;
  body: string;
  createdAt: Date;
  author: User;
  votes: Vote[];
  replies: Reply[];
}

export interface Reply extends Vote {
  id: string;
  body: string;
  createdAt: Date;
  author: User;
  votes: Vote[];
}

export interface PostBodyData {
  html: string;
  text: string;
}

export interface Reply {
  id: string;
  body: string;
  createdAt: string | Date;
  parentId?: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
  replies: Reply[];
}

export interface Comment extends Reply {
  id: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
  body: string;
  createdAt: string | Date;
  replies: Reply[];
  parentId?: string;
  isCollapsed?: boolean;
}

export interface SavedPost {
  id: string;
  postId: string;
  posts: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    community: {
      id: string;
      communityName: string;
      memberCount?: number;
    };
    _count?: {
      comments: number;
      votes: number;
    };
  };
  userId: string;
  createdAt: string;
}
