import { BaseQuery } from "../baseQuery";
import { RealisationsGlobal } from "./type";

class RealisationsGlobalQuery extends BaseQuery<RealisationsGlobal, RealisationsGlobal> {
  constructor() {
    super("/globals/RealisationsGlobal");
  }
}

export const realisationsGlobalQuery = new RealisationsGlobalQuery();