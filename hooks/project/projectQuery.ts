import { BaseQuery } from "../baseQuery";
import { ProjectResponse } from "./type";

class ProjectQuery extends BaseQuery<ProjectResponse, ProjectResponse> {
  constructor() {
    super("/project");
  }
}

export const projectQuery = new ProjectQuery();
