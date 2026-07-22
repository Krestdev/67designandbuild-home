import { BaseQuery } from "../baseQuery";
import { FooterResponse } from "./type";

class FooterQuery extends BaseQuery<FooterResponse, FooterResponse> {
  constructor() {
    super("/globals/footer");
  }
}

export const footerQuery = new FooterQuery();
