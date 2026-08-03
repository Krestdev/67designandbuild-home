import { BaseQuery } from "../baseQuery";
import { Career } from "./type";

class CareerQuery extends BaseQuery<Career, Career> {
  constructor() {
    super("/career");
  }
}

export const careerQuery = new CareerQuery();