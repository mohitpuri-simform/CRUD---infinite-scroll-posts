import { PostModel } from "../models/model";

export class Services {
  async getPost(postsPerPage: number, skipPosts: number): Promise<PostModel[]> {
    try {
      const response = await fetch(
        `https://dummyjson.com/posts?limit=${postsPerPage}&skip=${skipPosts}`
      );
      if (!response.ok) {
        throw new Error(`${response.status}: Something went wrong `);
      }
      const data = await response.json();
      return data.posts as PostModel[];
    } catch (error) {
      console.error(`Fetch:${error}`);
      throw error;
    }
  }
}
