import { IsString } from 'class-validator';

export default class User {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
