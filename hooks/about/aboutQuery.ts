import { BaseQuery } from "../baseQuery";
import { AboutResponse } from "./type";

class AboutQuery extends BaseQuery<AboutResponse, AboutResponse> {
  constructor() {
    super("/globals/about");
  }
}

export const aboutQuery = new AboutQuery();
