import { BaseQuery } from "../baseQuery";
import { CtaBannerResponse } from "./type";

class CtaBannerQuery extends BaseQuery<CtaBannerResponse, CtaBannerResponse> {
  constructor() {
    super("/globals/cta-banner");
  }
}

export const ctaBannerQuery = new CtaBannerQuery();
