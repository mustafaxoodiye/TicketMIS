import { TicketPriorityLevel, TicketStatus } from "@viewModels";

export class ChangeTicketStatusDTO {
    id: number;
    remarks: string;
    assignedTo: number | null;
    status: TicketStatus;
    priority: TicketPriorityLevel | null;
    endDate: string | null;
    flags: number[];
}