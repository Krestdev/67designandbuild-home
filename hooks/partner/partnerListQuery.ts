import { BaseQuery } from "../baseQuery";
import { Partner } from "./type";

class PartnerListQuery extends BaseQuery<Partner, Partner> {
  constructor() {
    super("/partners");
  }
}

export const partnerListQuery = new PartnerListQuery();