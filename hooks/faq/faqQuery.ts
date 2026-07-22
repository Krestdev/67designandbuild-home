import { BaseQuery } from "../baseQuery";
import { FaqResponse } from "./type";

class FaqQuery extends BaseQuery<FaqResponse, FaqResponse> {
  constructor() {
    super("/faq");
  }
}

export const faqQuery = new FaqQuery();
