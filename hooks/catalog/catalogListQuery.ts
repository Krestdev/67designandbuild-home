import { BaseListQuery } from "../baseListQuery";
import { CatalogPageGlobal } from "./type";

class CatalogQuery extends BaseListQuery<CatalogPageGlobal, CatalogPageGlobal> {
  constructor() {
    super("/catalog");
  }
}

export const catalogQuery = new CatalogQuery();