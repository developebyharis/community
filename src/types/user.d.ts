export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  provider: "google" | "credentials";
  role: "USER" | "MODERATOR"; 
  publicKey?: string;
  universityId?: string;
  createdAt: string;
  updatedAt: string;
};
