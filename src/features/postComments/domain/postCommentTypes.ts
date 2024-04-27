import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(20, 300, { message: 'Comment length is not correct' })
  content: string;
}

export class PostComment {
  constructor(
    public id: string,
    public userId: string,
    public content: string,
    public createdAt: Date,
    public commentatorInfo: { userId: string; userLogin: string },
  ) {}

  static mapper(comment): PostComment {
    return {
      // id: blog._id.toString(),
      id: comment._id.toString(),
      userId: comment.userId,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
    };
  }
}
