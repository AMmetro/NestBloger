import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogRepository } from 'src/blogs/blog.repo';

@ValidatorConstraint({ name: 'blogId', async: true })
@Injectable()
export class CustomBlogIdvalidation implements ValidatorConstraintInterface {
  constructor(private blogRepository: BlogRepository) {}

  async validate(value: string): Promise<boolean> {
    const isBlogExist = await this.blogRepository.findById(value);
    if (isBlogExist) {
      return true;
    } else {
      return false;
    }
  }
}
