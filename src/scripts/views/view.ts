import { attachClassName } from "../../utils";
import { API_INITIAL_POSTS, NO_POST_FOUND } from "../constants";
import { PostModel } from "../models/model";

export class View {
  addPost(posts: PostModel[]) {
    const postContainer: HTMLDivElement =
      document.querySelector(".posts-container")!;
    postContainer.textContent = "";
    postContainer.setAttribute("aria-live", "polite");

    if (posts.length === 0) {
      postContainer.textContent = NO_POST_FOUND;
    }
    posts.forEach((data: PostModel) => {
      const post = document.createElement("article");
      post.setAttribute("tabindex", "0");
      attachClassName(post, "post");

      const title = document.createElement("p");
      attachClassName(title, "post-title");
      title.setAttribute("tabindex", "0");
      title.setAttribute("aria-label", `${data.title}`);
      title.setAttribute("role", "heading");
      title.textContent = data.title;

      const content = document.createElement("p");
      attachClassName(content, "post-content");
      content.textContent = data.body;

      const tags = document.createElement("div");
      attachClassName(tags, "post-tags");
      for (const element of data.tags) {
        const span = document.createElement("button");
        span.textContent = element;
        tags.append(span);
      }

      const reactions = document.createElement("div");
      attachClassName(reactions, "post-reactions");

      const likes = document.createElement("p");
      attachClassName(likes, "post-likes");

      likes.textContent = data.reactions.likes.toString();

      const dislikes = document.createElement("p");
      attachClassName(dislikes, "post-dislikes");

      dislikes.textContent = data.reactions.dislikes.toString();

      const views = document.createElement("span");
      if (data.views) {
        attachClassName(views, "post-views");
        views.textContent = data.views.toString();
      }

      reactions.append(likes, dislikes);
      if (!data.views) {
        post.append(title, content, tags, reactions);
      } else {
        post.append(title, content, tags, views, reactions);
      }

      // skip appending delete and edit buttons if new post is created
      if (data.id <= API_INITIAL_POSTS) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("title", "Delete Post");
        deleteBtn.id = data.id.toString();

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.setAttribute("title", "Edit Post");
        editBtn.id = data.id.toString();

        const editDeleteContainer = document.createElement("div");
        attachClassName(editDeleteContainer, "edit-delete-container");
        editDeleteContainer.append(editBtn, deleteBtn);

        post.append(
          title,
          content,
          tags,
          views,
          reactions,
          editDeleteContainer
        );
      }
      postContainer.append(post);
    });
  }
}
