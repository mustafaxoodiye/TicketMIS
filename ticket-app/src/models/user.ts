import { Role } from "@models";
import { BaseModel } from "./baseModel";

export class User extends BaseModel {
    userName: string;
    isActive: boolean;
    roleId: number | null;
    role: Role;
    isSUDO: boolean;
}
