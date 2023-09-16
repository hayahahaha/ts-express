import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import PostController from './post/post.controller';
import AuthenticationController from './authentication/authentication.controller';
import CategoryController from './category/category.controller';

// validateEnv();

(async () => {
  const app = new App(
    [
      new PostController(),
      new AuthenticationController(),
      new CategoryController()
    ],
    3000
  );
  app.listen();
})();
