import { IsString, Length } from 'class-validator'; 

export class CreateCommentDto {
  @IsString()
  @Length(20, 300, { message: 'Comment length is not correct' })
  content: string;
}

export class CreateComment {
  constructor(
    public postId: string,
    public userId: string,
    public addedAt: Date,
  ) {}

  static mapper(comment): CreateComment {
    return {
      // id: blog._id.toString(),
      postId: comment.postId,
      userId: comment.userId,
      addedAt: comment.addedAt.toISOString(),
    };
  }
}