import { BaseModel } from "./baseModel";

export class Role extends BaseModel {
  name: string;
  description: string;
  permissions: string[];
}
