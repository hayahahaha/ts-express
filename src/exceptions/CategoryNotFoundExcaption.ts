import HttpException from './HttpException'

export default class CategoryNotFoundExcaption extends HttpException {
  constructor(id: number) {
    super(404, `Category with id ${id} not found!`);
  }
}
