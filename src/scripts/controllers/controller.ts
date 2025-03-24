import { View } from "../views/view";
import { Services } from "../services/services";

export class Controller {
  private skipPosts: number;
  private postsPerPage: number;

  constructor(skipPosts: number = 0, postsPerPage: number = 4) {
    this.skipPosts = skipPosts;
    this.postsPerPage = postsPerPage;
  }

  async displayPost() {
    const data = await Services.getPost(this.postsPerPage, this.skipPosts);
    console.log(data);

    View.addPost(data);
    this.skipPosts += this.postsPerPage;
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
