import { BaseQuery } from "../baseQuery";
import { Blog } from "./type";

class BlogListQuery extends BaseQuery<Blog, Blog> {
  constructor() {
    super("/blogs");
  }
}

export const blogListQuery = new BlogListQuery();