import { BaseQuery } from "../baseQuery";
import { Service } from "./type";

class ServiceListQuery extends BaseQuery<Service, Service> {
  constructor() {
    super("/service");
  }
}

export const serviceListQuery = new ServiceListQuery();