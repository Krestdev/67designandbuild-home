import { BaseQuery } from "../baseQuery";
import { Career } from "./type";

class CareerListQuery extends BaseQuery<Career, Career> {
  constructor() {
    super("/career");
  }
}

export const careerListQuery = new CareerListQuery();