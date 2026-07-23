import { BaseQuery } from "../baseQuery";
import { Career } from "./type";

class CareerListQuery extends BaseQuery<Career, Career> {
  constructor() {
    super("/careers");
  }
}

export const careerListQuery = new CareerListQuery();