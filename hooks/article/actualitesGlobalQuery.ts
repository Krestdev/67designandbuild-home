import { BaseQuery } from "../baseQuery";
import { ActualitesGlobal } from "./type";

class ActualitesGlobalQuery extends BaseQuery<ActualitesGlobal, ActualitesGlobal> {
  constructor() {
    super("/globals/ActualitesGlobal");
  }
}

export const actualitesGlobalQuery = new ActualitesGlobalQuery();