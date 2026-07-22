import { BaseQuery } from "../baseQuery";
import { HeaderResponse } from "./type";

class HeaderQuery extends BaseQuery<HeaderResponse, HeaderResponse> {
  constructor() {
    super("/globals/header");
  }
}

export const headerQuery = new HeaderQuery();
