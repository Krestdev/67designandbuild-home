import { BaseListQuery } from "../baseListQuery";
import { QuoteRequest, QuoteRequestInput } from "./type";

class QuoteRequestQuery extends BaseListQuery<QuoteRequest, QuoteRequestInput> {
  constructor() {
    super("/QuoteRequests");
  }
}

export const quoteRequestQuery = new QuoteRequestQuery();