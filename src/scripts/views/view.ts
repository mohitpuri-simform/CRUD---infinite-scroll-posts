import { PostModel } from "../models/model";

export class View {
  addPost(posts: PostModel[]) {
    const postContainer: HTMLDivElement =
      document.querySelector(".posts-container")!;
    posts.forEach((data: PostModel) => {
      // Create the DOM elements.
      const post = document.createElement("div");
      const title = document.createElement("p");
      const content = document.createElement("p");
      const tags = document.createElement("div");
      const reactions = document.createElement("div");
      const likes = document.createElement("p");
      const dislikes = document.createElement("p");
      const views = document.createElement("span");
      post.className = "post";
      title.className = "post-title";
      content.className = "post-content";
      tags.className = "post-tags";
      reactions.className = "post-reactions";
      likes.className = "post-likes";
      dislikes.className = "post-dislikes";
      views.className = "post-views";

      // Add the data to DOM.
      title.textContent = data.title;
      content.textContent = data.body;
      views.textContent = data.views.toString();
      for (const element of data.tags) {
        const span = document.createElement("p");
        span.textContent = element;
        tags.append(span);
      }
      likes.textContent = data.reactions.likes.toString();
      dislikes.textContent = data.reactions.dislikes.toString();
      reactions.append(likes, dislikes);
      post.append(title, content, tags, views, reactions);
      postContainer.append(post);
    });
  }
}
