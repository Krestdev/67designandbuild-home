import { BaseQuery } from "../baseQuery";
import { HomeResponse } from "./type";

class HomeQuery extends BaseQuery<HomeResponse, HomeResponse> {
  constructor() {
    super("/globals/home");
  }
}

export const homeQuery = new HomeQuery();