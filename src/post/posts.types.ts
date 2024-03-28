export class Post {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogName: Date,
    public blogId: Date,
    public createdAt: Date,
  ) {}

  // static mapper(obj) {
  //   return {
  //     id: obj._id,
  //     name: obj.name,
  //     description: obj.description,
  //     websiteUrl: obj.websiteUrl,
  //     createdAt: obj.createdAt,
  //     isMembership: obj.isMembership,
  //   };
  // }
  // }

  // export class BlogDto {
  //   constructor(
  //     public name: string,
  //     public description: string,
  //     public websiteUrl: string,
  //   ) {}
}
