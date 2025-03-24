export interface PostModel {
  body: string;
  reactions: {
    likes: string;
    dislikes: string;
  };
  tags: string[];
  title: string;
  views: string;
}
