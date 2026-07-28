import { BaseQuery } from "../baseQuery";
import { ContactGlobal } from "./type";

class ContactQuery extends BaseQuery<ContactGlobal, ContactGlobal> {
  constructor() {
    super("/globals/Contact");
  }
}

export const contactQuery = new ContactQuery();