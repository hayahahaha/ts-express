import { Request, Response, Router, NextFunction } from 'express';
import PostInterface from './post.interface';
import { CreatePostDto } from './post.dto'
import { AppDataSource } from "../data-source"
import HttpException from '../exceptions/HttpException';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import Post from './post.entity';
import User from '../user/user.entity';


class PostsController {
  public path = '/posts';
  public router = Router();
  private postRepository = AppDataSource.getRepository(Post);
  private userRepository = AppDataSource.getRepository(User);

  private posts: PostInterface[] = [
    {
      author: 'Marcin',
      content: 'Dolor sit amet',
      title: 'Lorem Ipsum',
    }
  ];

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getPosts);
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
    this.router.get(`${this.path}/:id`, this.getPostById)
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
    this.router.delete(`${this.path}/:id`, this.deletePost)
  }

  private getPosts = async (request: Request, response: Response) => {
    const posts = await this.postRepository.find();
    response.send(posts);
  }

  private getPostById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const post = await this.postRepository.findOneBy({
      id,
    })
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }

  private createPost = async (request: Request, response: Response) => {
    console.log('create Post:', request.body);
    const postData: CreatePostDto = request.body;
    const post = new Post();
    post.author = postData.author;
    post.content = postData.content;
    post.title = postData.title;

    const newPost = this.postRepository.create(post);
    await this.postRepository.save(newPost);
    response.json(newPost);
  }

  private modifyPost = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    console.log('id: ', id)
    const postData: Post = request.body;
    console.log('postData:', postData)
    await this.postRepository.update(id, postData);
    const updatedPost = await this.postRepository.findOneBy({ id });
    if (updatedPost) {
      response.send(updatedPost);
    } else {
      next(new HttpException(404, 'Post not found!'));
    }
  }

  private deletePost = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;

    const deleteResponse = await this.postRepository.delete(id);
    if (deleteResponse.raw[1]) {
      response.status(200).json({ status: 'Success!' });
    } else {
      next(new HttpException(404, 'Post not found!'));
    }
  }
}

export default PostsController;
