import { TicketStatus } from "@viewModels";

export class UserInfoViewModel {
    userId = 0;
    userName = '';
    roleId = 0;
    roleName = '';
    userType = '';
    fullName = '';
    accessLevel = '';
    accessableTickets: TicketStatus[];

    token = "";
}