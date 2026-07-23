import { BaseListQuery } from "../baseListQuery";
import { FaqPageGlobal } from "./type";

class FaqListQuery extends BaseListQuery<FaqPageGlobal, FaqPageGlobal> {
  constructor() {
    super("/faq");
  }
}

export const faqListQuery = new FaqListQuery();