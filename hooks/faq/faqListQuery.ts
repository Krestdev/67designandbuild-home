import { BaseQuery } from "../baseQuery";
import { FaqPageGlobal } from "./type";

class FaqListQuery extends BaseQuery<FaqPageGlobal, FaqPageGlobal> {
  constructor() {
    super("/faq");
  }
}

export const faqListQuery = new FaqListQuery();