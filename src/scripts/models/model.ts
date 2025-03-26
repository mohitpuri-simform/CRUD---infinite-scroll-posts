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
}

export type EditNewPostRequest = { title: string; body: string };
