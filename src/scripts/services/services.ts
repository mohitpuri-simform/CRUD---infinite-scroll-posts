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

  async searchPost(keyword: string): Promise<PostModel[]> {
    try {
      const response = await fetch(
        `https://dummyjson.com/posts/search?q=${keyword}`
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

  async editPost(
    id: number,
    newPost: { title: string; body: string }
  ): Promise<PostModel> {
    try {
      const response = await fetch(`https://dummyjson.com/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error(`${response.status}: Something went wrong `);
      }
      const data = await response.json();
      return data as PostModel;
    } catch (error) {
      console.error(`Fetch:${error}`);
      throw error;
    }
  }

  async deletePost(id: number): Promise<PostModel> {
    try {
      const response = await fetch(`https://dummyjson.com/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`${response.status}: Something went wrong `);
      }
      const data = await response.json();
      return data as PostModel;
    } catch (error) {
      console.error(`Fetch:${error}`);
      throw error;
    }
  }
}
