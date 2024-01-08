import { Project } from "@models";
import { BaseModel } from "./baseModel";

export class WorkGroup extends BaseModel {
    name: string;
    projectId: number;
    project: Project;
    // workGroupUsers: WorkGroupUser[];
}