import { User } from "./user";

export class BaseModel {
    id: number;
    createdById: number | null;
    createdBy: User | null;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
