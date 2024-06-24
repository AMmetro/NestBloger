import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(20, 300, { message: 'Comment length is not correct' })
  content: string;
}

export class PostComment {
  constructor(
    public id: string,
    public content: string,
    public createdAt: Date,
    public commentatorInfo: { userId: string; userLogin: string },
  ) {}

  static mapper(comment): any {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt, 
      // commentatorInfo: {
      //   userId: comment.commentatorInfo.userId,
      //   userLogin: comment.commentatorInfo.userLogin,
      // },
    };
  }
  static mapperWithCommentator(comment): any {

    const commentModel =  {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: {
        userId: comment.user.id,
        userLogin: comment.user.login,
      },
    };

    return commentModel;
  }
}

export type newLikeType = {
  postId: string,
  userId: string,
  myStatus: string,
  addedAt: Date,
};
