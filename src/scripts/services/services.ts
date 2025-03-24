import { PostModel } from "../models/model";

export class Services {
  static async getPost(
    postsPerPage: number,
    skipPosts: number
  ): Promise<PostModel[]> {
    try {
      const response = await fetch(
        `https://dummyjson.com/posts?limit=${postsPerPage}&skip=${skipPosts}`
      );
      if (!response.ok) {
        throw new Error(`${response.status}: Something went wrong `);
      }
      const data = await response.json();
      console.log(data);

      return data.posts as PostModel[];
    } catch (error) {
      console.error(`Fetch:${error}`);
      return [] as PostModel[];
    }
  }
}
