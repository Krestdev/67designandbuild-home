import { BaseListQuery } from "../baseListQuery";
import { Faq } from "./type";

class FaqListQuery extends BaseListQuery<Faq, Faq> {
  constructor() {
    super("/faqs");
  }
}

export const faqListQuery = new FaqListQuery();