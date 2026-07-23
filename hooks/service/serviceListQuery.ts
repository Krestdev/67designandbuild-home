import { BaseListQuery } from "../baseListQuery";
import { Service } from "./type";

class ServiceListQuery extends BaseListQuery<Service, Service> {
  constructor() {
    super("/Services");
  }
}

export const serviceListQuery = new ServiceListQuery();