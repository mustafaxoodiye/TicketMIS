import { Project } from "@models";
import { BaseModel } from "./baseModel";

export class Flag extends BaseModel {
    name: string;
    projectId: number;
    project: Project;
}