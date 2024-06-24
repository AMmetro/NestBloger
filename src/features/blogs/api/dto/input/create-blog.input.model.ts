import { IsString, Length, Matches } from 'class-validator';
import { Trim } from 'src/common/decorators/transform/trim';

export type UpdateBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export class IncomBlogDto {
  @IsString()
  @Trim()
  @Length(1, 15, { message: 'blog name length is not correct' })
  name: string;

  @IsString()
  @Trim()
  @Length(1, 500, { message: 'description length is not correct' })
  description: string;

  @IsString()
  @Matches(
    new RegExp(
      '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
    ),
    {
      message: 'websiteUrl pattern is not correct',
    },
  )
  @Length(1, 100, { message: 'websiteUrl length is not correct' })
  websiteUrl: string;
}
