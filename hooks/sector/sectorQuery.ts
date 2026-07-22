import { BaseQuery } from "../baseQuery";
import { SectorResponse } from "./type";

class SectorQuery extends BaseQuery<SectorResponse, SectorResponse> {
  constructor() {
    super("/sector");
  }
}

export const sectorQuery = new SectorQuery();
