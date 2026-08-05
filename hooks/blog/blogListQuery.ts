import { BaseQuery } from "../baseQuery";
import { Blog } from "./type";

class BlogListQuery extends BaseQuery<Blog, Blog> {
  constructor() {
    super("/blog");
  }
}

export const blogListQuery = new BlogListQuery();