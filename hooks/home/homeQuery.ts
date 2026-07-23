import { BaseQuery } from "../baseQuery";
import { HomeGlobal } from "./type";

class HomeQuery extends BaseQuery<HomeGlobal, HomeGlobal> {
  constructor() {
    super("/globals/home");
  }
}

export const homeQuery = new HomeQuery();