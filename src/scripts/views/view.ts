import { attachClassName } from "../../utils";
import { NO_POST_FOUND } from "../constants";
import { PostModel } from "../models/model";

export class View {
  addPost(posts: PostModel[]) {
    const postContainer: HTMLDivElement =
      document.querySelector(".posts-container")!;
    postContainer.textContent = "";
    if (posts.length === 0) {
      postContainer.textContent = NO_POST_FOUND;
    }
    posts.forEach((data: PostModel) => {
      const post = document.createElement("div");
      attachClassName(post, "post");

      const title = document.createElement("p");
      attachClassName(title, "post-title");
      title.textContent = data.title;

      const content = document.createElement("p");
      attachClassName(content, "post-content");
      content.textContent = data.body;

      const tags = document.createElement("div");
      attachClassName(tags, "post-tags");
      for (const element of data.tags) {
        const span = document.createElement("p");
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
      attachClassName(views, "post-views");

      views.textContent = data.views.toString();

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.id = data.id.toString();

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.id = data.id.toString();

      const editDeleteContainer = document.createElement("div");
      attachClassName(editDeleteContainer, "edit-delete-container");

      reactions.append(likes, dislikes);
      editDeleteContainer.append(editBtn, deleteBtn);
      post.append(title, content, tags, views, reactions, editDeleteContainer);
      postContainer.append(post);
    });
  }
}
