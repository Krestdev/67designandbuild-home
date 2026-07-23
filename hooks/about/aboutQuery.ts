import { BaseQuery } from "../baseQuery";
import { AboutGlobal } from "./type";

class AboutQuery extends BaseQuery<AboutGlobal, AboutGlobal> {
  constructor() {
    super("/globals/about");
  }
}

export const aboutQuery = new AboutQuery();