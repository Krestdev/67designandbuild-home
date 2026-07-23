import { BaseQuery } from "../baseQuery";
import { ServicePageGlobal } from "./type";

class ServiceQuery extends BaseQuery<ServicePageGlobal, ServicePageGlobal> {
  constructor() {
    super("/globals/Service");
  }
}

export const serviceQuery = new ServiceQuery();