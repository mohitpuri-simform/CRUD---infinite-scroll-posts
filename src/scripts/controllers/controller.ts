import { View } from "../views/view";
import { Services } from "../services/services";
import {
  SKIP_POSTS,
  POSTS_PER_PAGE,
  SERVER_DOWN,
  DELETE,
  EDIT,
  ENTER,
  LIKES_COUNTER,
  DISLIKES_COUNTER,
  USER_ID,
} from "../constants";
import {
  createdPostModel,
  EditNewPostRequest,
  PostModel,
} from "../models/model";
import { debounce } from "../../utils";

export class Controller {
  private skipPosts: number = SKIP_POSTS;
  private postsPerPage: number = POSTS_PER_PAGE;
  view: View;
  apiServices: Services;
  private posts: PostModel[];
  private checkIfFetching: boolean;
  private checkIfSearching: boolean;
  private debounceSearch: (keyword: string) => void;

  constructor() {
    this.apiServices = new Services();
    this.view = new View();
    this.posts = [];
    this.checkIfFetching = false;
    this.checkIfSearching = false;
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
      }
      alert(SERVER_DOWN);
    }
  }

  async editPostWithID(id: number, newPost: EditNewPostRequest) {
    try {
      const data = await this.apiServices.editPost(id, newPost);
      console.log(data);

      const arr: PostModel[] = [];
      this.posts.map((item) => {
        if (item.id === data.id) {
          item.body = data.body;
          item.title = data.title;
        }
        arr.push(item);
      });
      this.posts = [...arr];
      this.view.addPost(this.posts);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
      alert(SERVER_DOWN);
    }
  }

  async deletePostWithID(id: number): Promise<void> {
    try {
      const data = await this.apiServices.deletePost(id);
      const updatedPosts: PostModel[] = this.posts.filter(
        (e) => e.id !== data.id
      );
      this.posts = [...updatedPosts];
      this.view.addPost(this.posts);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
      alert(SERVER_DOWN);
    }
  }

  async createPostAndAddToDisplay(newPost: createdPostModel) {
    try {
      const data = await this.apiServices.createPost(newPost);
      const updatedPosts: PostModel[] = [];
      console.log(data);

      updatedPosts.push(data);
      console.log(updatedPosts);

      this.posts = [...updatedPosts, ...this.posts];
      this.view.addPost(this.posts);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        alert(error.message);
      }
      alert(SERVER_DOWN);
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

    const addPostForm: HTMLButtonElement =
      document.querySelector(".create-new-post")!;

    addPostForm.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      const postTitle: HTMLInputElement = document.querySelector(
        "#title"
      )! as HTMLInputElement;

      const postContent = document.querySelector(
        "#content"
      )! as HTMLTextAreaElement;

      const postTag1: HTMLInputElement = document.querySelector(
        "#tag1"
      )! as HTMLInputElement;
      const postTag2: HTMLInputElement = document.querySelector(
        "#tag2"
      )! as HTMLInputElement;

      const tag1Value = postTag1.value.trim();
      const tag2Value = postTag2.value.trim();
      const postTags: string[] = [];
      if (tag1Value !== "") {
        postTags.push(tag1Value);
      }
      if (tag2Value !== "") {
        postTags.push(tag2Value);
      }

      const newPostContent = postContent.value.trim();
      const newPostTitle = postTitle.value.trim();
      if (postContent && postTitle) {
        const newPost: createdPostModel = {
          title: newPostTitle,
          body: newPostContent,
          userId: USER_ID,
          tags: postTags,
          reactions: { likes: LIKES_COUNTER, dislikes: DISLIKES_COUNTER },
          views: 1,
        };
        this.createPostAndAddToDisplay(newPost);
      }
      postTitle.value = "";
      postContent.value = "";
      postTag1.value = "";
      postTag2.value = "";
    });

    const searchInput: HTMLInputElement = document.querySelector("#search")!;
    searchInput.addEventListener("input", (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLInputElement) {
        const inputVal = target.value;
        this.debounceSearch(inputVal);
      }
    });

    const PostContainer: HTMLDivElement =
      document.querySelector(".posts-container")!;

    PostContainer.addEventListener("click", (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLButtonElement) {
        const postID: number = Number(target.id);

        if (target.closest("button")!.textContent === DELETE) {
          this.deletePostWithID(postID);
        }

        if (target.closest("button")!.textContent === EDIT) {
          const postTitle = target
            .closest(".post")!
            .querySelector(".post-title")!;
          const postContent = target
            .closest(".post")!
            .querySelector(".post-content")!;

          const inputTitle = document.createElement("input");
          const inputContent = document.createElement("textarea");

          inputTitle.type = "text";
          inputTitle.value = postTitle.textContent || "";
          inputContent.value = postContent.textContent || "";

          inputTitle.classList.add("edit-input");
          inputContent.classList.add("edit-input");

          postTitle.replaceWith(inputTitle);
          postContent.replaceWith(inputContent);

          inputTitle.focus();

          inputTitle.addEventListener("blur", () => {
            postTitle.textContent =
              inputTitle.value.trim() || postTitle.textContent;
            inputTitle.replaceWith(postTitle);
            inputContent.focus();
          });

          inputContent.addEventListener("blur", () => {
            postContent.textContent =
              inputContent.value.trim() || postContent.textContent;
            inputContent.replaceWith(postContent);
          });

          const newPost: EditNewPostRequest = {
            title: postTitle.textContent!,
            body: postContent.textContent!,
          };
          inputTitle.addEventListener("keypress", (e: KeyboardEvent) => {
            if (e.key === ENTER) {
              inputTitle.blur();
              inputContent.blur();
              this.editPostWithID(postID, newPost);
            }
          });
        }
      }
    });
  }
}
