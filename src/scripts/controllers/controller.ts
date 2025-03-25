import { View } from "../views/view";
import { Services } from "../services/services";
import { POSTS_PER_PAGE, SKIP_POSTS } from "../constants";

export class Controller {
  private skipPosts: number = SKIP_POSTS;
  private postsPerPage: number = POSTS_PER_PAGE;
  view: View;
  apiServices: Services;

  constructor() {
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
        return alert(error.message);
      }
      alert("please try again later");
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
