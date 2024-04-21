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

export class PostLike {
  constructor(
    public postId: string,
    public userId: string,
    public myStatus: string,
    public addedAt: Date,
  ) {}

  static mapper(PostLike) {
    return {
      id: PostLike._id.toString(),
      postId: PostLike.postId,
      userId: PostLike.userId,
      myStatus: PostLike.myStatus,
      addedAt: PostLike.addedAt.toISOString(),
    };
  }
}

// @Prop({ required: true })
// postId: string;
// @Prop({ required: true })
// userId: string;
// @Prop({ required: true })
// myStatus: string;
// @Prop({ required: true })
// addedAt: Date;

// export class LikeStatusEnumDto {
//   @IsEnum(likeStatusEnum2)
//   value: likeStatusEnum2;
// }

// export class IncomLikeStatusDTO {
//   @ValidateNested({ each: true })
//   @Type(() => likeStatusEnum)
//   @IsEnum(likeStatusEnum, { each: true })
//   values: 
// }

