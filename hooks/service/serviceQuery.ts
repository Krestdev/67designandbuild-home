import { BaseQuery } from "../baseQuery";
import { ServiceResponse } from "./type";

class ServiceQuery extends BaseQuery<ServiceResponse, ServiceResponse> {
  constructor() {
    super("/service");
  }
}

export const serviceQuery = new ServiceQuery();
