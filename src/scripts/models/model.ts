interface Reactions {
  likes: number;
  dislikes: number;
}

export interface PostModel {
  id: number;
  body: string;
  reactions: Reactions;
  tags: string[];
  title: string;
  views: number;
  userId: number;
}

export interface createdPostModel {
  body: string;
  reactions: Reactions;
  tags: string[];
  title: string;
  views: number;
  userId: number;
}

export type EditNewPostRequest = { title: string; body: string };
