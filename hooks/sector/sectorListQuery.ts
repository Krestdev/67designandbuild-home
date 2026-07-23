import { BaseListQuery } from "../baseListQuery";
import { Sector } from "./type";

class SectorListQuery extends BaseListQuery<Sector, Sector> {
  constructor() {
    super("/sector");
  }
}

export const sectorListQuery = new SectorListQuery();