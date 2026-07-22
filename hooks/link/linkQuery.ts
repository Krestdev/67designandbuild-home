import { BaseQuery } from "../baseQuery";
import { LinkResponse } from "./type";

class LinkQuery extends BaseQuery<LinkResponse, LinkResponse> {
  constructor() {
    super("/link");
  }
}

export const linkQuery = new LinkQuery();
