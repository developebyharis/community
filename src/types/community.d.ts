export type Community = {
  id: string;
  communityName: string;
  avatar?: string;
  membersCount: number;
  createdAt?: string;
  description: string;
  followers?: [];
};

export interface FollowedCommunities {
  communityName: string;
  createdAt: string;
  createdBy: {
    avatar: string;
    createdAt: string;
    email: string;
    id: string;
    name: string;
    provider: string;
    publicKey: string | null;
    updatedAt: string;
    username: string;
  };
  createdById: string;
  description: string;

  followers: {
    avatar: string;
    createdAt: string;
    email: string;
    id: string;
    name: string;
    updatedAt: string;
    username: string;
  };

  id: string;
  public: boolean;
  topics: [];
  updatedAt: string;
}
