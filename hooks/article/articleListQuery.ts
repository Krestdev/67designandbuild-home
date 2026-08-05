import { BaseListQuery } from "../baseListQuery";
import { Article } from "./type";

class ArticleListQuery extends BaseListQuery<Article, Article> {
  constructor() {
    super("/articles");
  }
}

export const articleListQuery = new ArticleListQuery();