import { BaseQuery } from "../baseQuery";
import { Sector } from "./type";

class SectorListQuery extends BaseQuery<Sector, Sector> {
  constructor() {
    super("/sector");
  }
}

export const sectorListQuery = new SectorListQuery();