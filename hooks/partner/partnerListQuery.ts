import { BaseListQuery } from "../baseListQuery";
import { Partner } from "./type";

class PartnerListQuery extends BaseListQuery<Partner, Partner> {
  constructor() {
    super("/partners");
  }
}

export const partnerListQuery = new PartnerListQuery();