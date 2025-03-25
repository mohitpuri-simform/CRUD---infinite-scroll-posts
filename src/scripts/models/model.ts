export interface PostModel {
  id: number;
  body: string;
  reactions: {
    likes: number;
    dislikes: number;
  };
  tags: string[];
  title: string;
  views: number;
}
