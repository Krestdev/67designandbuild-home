import { BaseQuery } from "../baseQuery";
import { NavbarGlobal } from "./type";

class NavbarQuery extends BaseQuery<NavbarGlobal, NavbarGlobal> {
  constructor() {
    super("/globals/navbar");
  }
}

export const navbarQuery = new NavbarQuery();