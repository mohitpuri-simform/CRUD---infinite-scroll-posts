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
      post.className = "post";

      const title = document.createElement("p");
      title.className = "post-title";
      title.textContent = data.title;

      const content = document.createElement("p");
      content.className = "post-content";
      content.textContent = data.body;

      const tags = document.createElement("div");
      tags.className = "post-tags";
      for (const element of data.tags) {
        const span = document.createElement("p");
        span.textContent = element;
        tags.append(span);
      }

      const reactions = document.createElement("div");
      reactions.className = "post-reactions";

      const likes = document.createElement("p");
      likes.className = "post-likes";
      likes.textContent = data.reactions.likes.toString();

      const dislikes = document.createElement("p");
      dislikes.className = "post-dislikes";
      dislikes.textContent = data.reactions.dislikes.toString();

      const views = document.createElement("span");
      views.className = "post-views";
      views.textContent = data.views.toString();

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.id = data.id.toString();

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.id = data.id.toString();

      const editDeleteContainer = document.createElement("div");
      editDeleteContainer.className = "edit-delete-container";

      reactions.append(likes, dislikes);
      editDeleteContainer.append(editBtn, deleteBtn);
      post.append(title, content, tags, views, reactions, editDeleteContainer);
      postContainer.append(post);
    });
  }
}
