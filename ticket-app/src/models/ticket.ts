import { Project, User, WorkGroup } from "@models";
import { TicketPriorityLevel, TicketStatus } from "@viewModels";
import { BaseModel } from "./baseModel";

export class Ticket extends BaseModel {
    title: string;
    description: string;
    priority: TicketPriorityLevel;
    projectId: number;
    project: Project;
    status: TicketStatus;
    assignedToId: number | null;
    assignedTo: WorkGroup | null;
    responsibleId: number | null;
    responsible: User | null;
    flags: number[];
}