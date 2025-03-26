import { View } from "../views/view";
import { Services } from "../services/services";
import { SKIP_POSTS, POSTS_PER_PAGE, SERVER_DOWN } from "../constants";
import { PostModel } from "../models/model";
import { debounce } from "../../utils";

export class Controller {
  private skipPosts: number = SKIP_POSTS;
  private postsPerPage: number = POSTS_PER_PAGE;
  view: View;
  apiServices: Services;
  private posts: PostModel[];
  private checkIfFetching: boolean;
  private checkIfSearching: boolean;
  // private debouncer: ReturnType<typeof setTimeout> | null;
  private debounceSearch: (keyword: string) => void;

  constructor() {
    this.apiServices = new Services();
    this.view = new View();
    this.posts = [];
    this.checkIfFetching = false;
    this.checkIfSearching = false;
    // this.debouncer = null;
    this.debounceSearch = debounce(this.searchPostWithKeyword.bind(this), 500);
  }

  async displayPost(): Promise<void> {
    if (this.checkIfFetching || this.checkIfSearching) return;
    this.checkIfFetching = true;
    try {
      const data = await this.apiServices.getPost(
        this.postsPerPage,
        this.skipPosts
      );
      if (data.length > 0) {
        this.posts = [...this.posts, ...data];
        this.view.addPost(this.posts);
        this.skipPosts += this.postsPerPage;
      }
      this.checkIfFetching = false;
    } catch (error) {
      if (error instanceof Error) {
        return alert(error.message);
      }
      alert(SERVER_DOWN);
    }
  }

  async searchPostWithKeyword(keyword: string): Promise<void> {
    if (!keyword.trim()) {
      this.checkIfSearching = false;
      this.skipPosts = 0;
      this.posts = [];
      await this.displayPost();
      return;
    }

    this.checkIfSearching = true;

    try {
      const data = await this.apiServices.searchPost(keyword);
      this.view.addPost(data);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(SERVER_DOWN);
      }
    }
  }

  infinteScrollPosts() {
    this.displayPost();
    window.addEventListener("scroll", () => {
      if (
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight &&
        !this.checkIfFetching &&
        !this.checkIfSearching
      ) {
        this.displayPost();
      }
    });

    const searchInput: HTMLInputElement = document.querySelector("#search")!;
    searchInput.addEventListener("input", (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLInputElement) {
        const inputVal = target.value;
        // this.searchPostWithKeyword(inputVal);
        this.debounceSearch(inputVal);
      }
    });
  }
}
