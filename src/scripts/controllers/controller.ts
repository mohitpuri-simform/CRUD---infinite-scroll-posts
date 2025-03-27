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
  EMPTY_FIELD,
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

  /**
   * @description this controller method is used to display the posts for the infinite scrolling and fetch the API service to retrive post
   * @return {*}  {Promise<void>}
   * @memberof Controller
   */
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

  /**
   * this controller method is used to search a post with related keyword and pass the keyword to the API to search a post
   * @param {string} keyword
   * @return {*}  {Promise<void>}
   * @memberof Controller
   */
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

  /**
   * @description this controller method is used to pass the ID and title, description to the editPost Service API
   * @param {number} id
   * @param {EditNewPostRequest} newPost
   * @memberof Controller
   */
  async editPostWithID(id: number, newPost: EditNewPostRequest) {
    try {
      const data = await this.apiServices.editPost(id, newPost);

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

  /**
   * this controller is used to pass the ID to the deletePost Service API to delete a post
   * @param {number} id
   * @return {*}  {Promise<void>}
   * @memberof Controller
   */
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

  /**
   * this controller is used to pass the newPost content to the createPost Service API
   * @param {createdPostModel} newPost
   * @memberof Controller
   */
  async createPostAndAddToDisplay(newPost: createdPostModel) {
    try {
      const data = await this.apiServices.createPost(newPost);
      const updatedPosts: PostModel[] = [];

      updatedPosts.push(data);

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

  /**
   * @description this method is used to display the posts infinitly
   * @memberof Controller
   */
  infinteScrollPosts() {
    this.displayPost();
    window.addEventListener("scroll", () => {
      if (
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 150 &&
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
      const postTitle: HTMLInputElement = document.querySelector("#title")!;

      const postContent = document.querySelector(
        "#content"
      )! as HTMLTextAreaElement;

      const postTag1: HTMLInputElement = document.querySelector("#tag1")!;
      const postTag2: HTMLInputElement = document.querySelector("#tag2")!;

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

      if (newPostContent === "" || newPostTitle === "") {
        alert(EMPTY_FIELD);
        return;
      }
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
