import { BaseListQuery } from "../baseListQuery";
import { Blog } from "./type";

class BlogListQuery extends BaseListQuery<Blog, Blog> {
  constructor() {
    super("/blog");
  }
}

export const blogListQuery = new BlogListQuery();