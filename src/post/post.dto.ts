import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  author: string;

  @IsString()
  content: string;

  @IsString()
  title: string;
}
