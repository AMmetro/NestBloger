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
    public createdAt: Date,
    public commentatorInfo: { userId: string; userLogin: string },
  ) {}

  static mapper(comment): CreateComment {
    return {
      // id: blog._id.toString(),
      postId: comment.postId,
      userId: comment.userId,
      createdAt: comment.createdAt.toISOString(),
      commentatorInfo: comment.commentatorInfo,
    };
  }
}