import { Controller } from "./controllers/controller";

document.addEventListener("DOMContentLoaded", () => {
  const controller = new Controller();
  controller.infinteScrollPosts();
});
