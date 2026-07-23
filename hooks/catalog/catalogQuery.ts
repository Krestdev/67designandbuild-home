import { BaseQuery } from "../baseQuery";
import { CatalogPageGlobal } from "./type";

class CatalogQuery extends BaseQuery<CatalogPageGlobal, CatalogPageGlobal> {
  constructor() {
    super("/globals/catalog");
  }
}

export const catalogQuery = new CatalogQuery();