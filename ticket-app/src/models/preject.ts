import { BaseModel } from "./baseModel";

export class Project extends BaseModel {
    name: string;
    hasApprovalWorkflow: boolean;
    numberOfApprovals: number;
}