import { BaseQuery } from "../baseQuery";
import { MediaResponse } from "./type";

class MediaQuery extends BaseQuery<MediaResponse, MediaResponse> {
  constructor() {
    super("/media");
  }
}

export const mediaQuery = new MediaQuery();
