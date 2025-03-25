import { View } from "../views/view";
import { Services } from "../services/services";

export class Controller {
  private skipPosts: number;
  private postsPerPage: number;
  view: View;
  apiServices: Services;

  constructor(skipPosts: number = 0, postsPerPage: number = 4) {
    this.skipPosts = skipPosts;
    this.postsPerPage = postsPerPage;
    this.apiServices = new Services();
    this.view = new View();
  }

  async displayPost() {
    try {
      const data = await this.apiServices.getPost(
        this.postsPerPage,
        this.skipPosts
      );

      this.view.addPost(data);
      this.skipPosts += this.postsPerPage;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("please try again later");
      }
    }
  }

  infinteScrollPosts() {
    this.displayPost();
    window.addEventListener("scroll", () => {
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight
      ) {
        this.displayPost();
      }
    });
  }
}
