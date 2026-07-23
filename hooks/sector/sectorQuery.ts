import { BaseQuery } from "../baseQuery";
import { SectorPageGlobal } from "./type";

class SectorQuery extends BaseQuery<SectorPageGlobal, SectorPageGlobal> {
  constructor() {
    super("/globals/sector");
  }
}

export const sectorQuery = new SectorQuery();