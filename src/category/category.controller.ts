
import { Request, Response, Router, NextFunction } from 'express';
import { AppDataSource } from "../data-source"
import HttpException from '../exceptions/HttpException';
import validationMiddleware from '../middleware/validation.middleware';
import Category from './category.entity';
import authMiddleware from '../middleware/auth.middleware';
import CategoryInterface from './category.interface';
import CategoryNotFoundExcaption from '../exceptions/CategoryNotFoundExcaption';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'

class CategoryController {
  public path = '/categories';
  public router = Router();

  private categoryRepository = AppDataSource.getRepository(Category);

  private category: CategoryInterface = {
    name: "Timeline"
  }

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getCategories);
    this.router.get(`${this.path}/:id`, this.getCategoryById)
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(UpdateCategoryDto, true), this.modifyCategory)
      .delete(`${this.path}/:id`, this.deleteCategory)
      .post(this.path, authMiddleware, validationMiddleware(CreateCategoryDto), this.createCategory);
  }

  private getCategories = async (request: Request, response: Response) => {
    const categories = await this.categoryRepository.find();
    response.send(categories);
  }

  private getCategoryById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const category = await this.categoryRepository.findOneBy({
      id,
    })
    if (category) {
      response.send(category);
    } else {
      next(new CategoryNotFoundExcaption(id));
    }
  }

  private createCategory = async (request: Request, response: Response) => {
    console.log('create category:', request.body);
    const categoryData: CreateCategoryDto = request.body;

    const category = new Category();
    category.name = categoryData.name;

    const newCategory = this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    response.json(newCategory);
  }

  private modifyCategory = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    console.log('id: ', id)

    const categoryData: Category = request.body;
    console.log('Category:', Category)
    await this.categoryRepository.update(id, categoryData);
    const updatedCategory = await this.categoryRepository.findOneBy({ id });
    if (updatedCategory) {
      response.send(updatedCategory);
    } else {
      next(new HttpException(404, 'Category not found!'));
    }
  }

  private deleteCategory = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;

    const deleteResponse = await this.categoryRepository.delete(id);
    if (deleteResponse.raw[1]) {
      response.status(200).json({ status: 'Success!' });
    } else {
      next(new HttpException(404, 'Category not found!'));
    }
  }
}

export default CategoryController;
