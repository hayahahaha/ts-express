import HttpException from './HttpException'

export default class PostNotFoundException extends HttpException {
  constructor(id: number) {
    super(404, `Post with id ${id} not found!`);
  }
}
