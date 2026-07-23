import { BaseQuery } from "../baseQuery";
import { FooterGlobal } from "./type";

class FooterQuery extends BaseQuery<FooterGlobal, FooterGlobal> {
  constructor() {
    super("/globals/footer");
  }
}

export const footerQuery = new FooterQuery();