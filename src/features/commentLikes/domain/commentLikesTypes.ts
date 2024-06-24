import { IsString } from 'class-validator';

export const likeStatusEnum = {
  None: 'None',
  Like: 'Like',
  Dislike: 'Dislike',
};

export class IncomLikeStatusDTO {
  @IsString()
  likeStatus: string;
}

export class CommentLike {
  constructor(
    // public postCommentsId: string,
    public userId: string,
    public myStatus: string,
    public addedAt: Date,
    public commentId: string,
  ) {}

  static mapper(CommentLike) {
    return {
      id: CommentLike._id.toString(),
      commentId: CommentLike.commentId,
      userId: CommentLike.userId,
      myStatus: CommentLike.myStatus,
      addedAt: CommentLike.addedAt.toISOString(),
    };
  }
}
