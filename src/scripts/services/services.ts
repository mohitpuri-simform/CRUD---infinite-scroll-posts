import { PostModel } from "../models/model";

export class Services {
  /**
   * @description this service is used to retrive the data from the API with a limit of 4 posts per page
   * @param {number} postsPerPage
   * @param {number} skipPosts
   * @return {*}  {Promise<PostModel[]>}
   * @memberof Services
   */
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

  /**
   * @description this service is used to search a post with related keyword content
   * @param {string} keyword
   * @return {*}  {Promise<PostModel[]>}
   * @memberof Services
   */
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

  /**
   *
   * @description this service is used to create a new post with a title and content of the post
   * @param {{ title: string; body: string; userId: number }} newPost
   * @return {*}
   * @memberof Services
   */
  async createPost(newPost: { title: string; body: string; userId: number }) {
    try {
      const response = await fetch("https://dummyjson.com/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error(`${response.status}: Something went wrong `);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Fetch:${error}`);
      throw error;
    }
  }

  /**
   * @description this service is used to edit the post title and description of the post
   * @param {number} id
   * @param {{ title: string; body: string }} newPost
   * @return {*}  {Promise<PostModel>}
   * @memberof Services
   */
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

  /**
   *@description this service is used to delete a post with a specific id
   * @param {number} id
   * @return {*}  {Promise<PostModel>}
   * @memberof Services
   */
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
