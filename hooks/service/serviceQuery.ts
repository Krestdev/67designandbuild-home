import { BaseQuery } from "../baseQuery";
import { ServicePageGlobal } from "./type";

class ServiceQuery extends BaseQuery<ServicePageGlobal, ServicePageGlobal> {
  constructor() {
    super("/globals/service");
  }
}

export const serviceQuery = new ServiceQuery();