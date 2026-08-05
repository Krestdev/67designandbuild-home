import { BaseListQuery } from "../baseListQuery";
import { Category } from "./type";

class CategoryListQuery extends BaseListQuery<Category, Category> {
  constructor() {
    super("/categories");
  }
}

export const categoryListQuery = new CategoryListQuery();