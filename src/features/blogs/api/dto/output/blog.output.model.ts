type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

export type OutputBlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: Boolean;
};

export type OutputBlogPostType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: OutputBlogType;
};



