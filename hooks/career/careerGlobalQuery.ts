import { BaseQuery } from "../baseQuery";
import { CareerGlobal } from "./type";

class CareerGlobalQuery extends BaseQuery<CareerGlobal, CareerGlobal> {
  constructor() {
    super("/globals/CareerGlobal");
  }
}

export const careerGlobalQuery = new CareerGlobalQuery();
n