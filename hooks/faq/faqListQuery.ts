import { BaseQuery } from "../baseQuery";
import { FaqPageGlobal } from "./type";

class FaqQuery extends BaseQuery<FaqPageGlobal, FaqPageGlobal> {
  constructor() {
    super("/faq");
  }
}

export const faqQuery = new FaqQuery();