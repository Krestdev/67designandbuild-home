import { BaseQuery } from "../baseQuery";
import { CtaBannerGlobal } from "./type";

class CtaBannerQuery extends BaseQuery<CtaBannerGlobal, CtaBannerGlobal> {
  constructor() {
    super("/globals/cta");
  }
}

export const ctaBannerQuery = new CtaBannerQuery();