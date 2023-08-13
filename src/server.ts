import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import config from './ormconfig';
import PostController from './post/post.controller';
import validateEnv from './utils/validateEnv';
import { AppDataSource } from './data-source';

// validateEnv();

(async () => {
  const app = new App(
    [
      new PostController(),
    ],
    3000
  );
  app.listen();
})();
