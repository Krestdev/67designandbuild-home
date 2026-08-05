import { BaseListQuery } from "../baseListQuery";
import { Catalog } from "./type";

class CatalogListQuery extends BaseListQuery<Catalog, Catalog> {
  constructor() {
    super("/catalogs");
  }
}

export const catalogListQuery = new CatalogListQuery();