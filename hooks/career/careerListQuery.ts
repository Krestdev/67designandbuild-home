import { BaseListQuery } from "../baseListQuery";
import { Career } from "./type";

class CareerListQuery extends BaseListQuery<Career, Career> {
  constructor() {
    super("/career");
  }
}

export const careerListQuery = new CareerListQuery();