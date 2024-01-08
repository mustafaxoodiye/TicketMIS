import { BaseModel, Ticket } from "@models";
import { TicketStatus } from "@viewModels";

export class TicketRevision extends BaseModel {
    ticketId: number;
    ticket: Ticket;
    remarks: string;
    status: TicketStatus;
}