enum User {
  users = "Appusers",
  login = "auth",
  checkSession = 'AppUsers/CheckSession',
}

enum Invoice {
  invoices = "Invoices",
}

enum Role {
  roles = "roles",
}

enum WorkGroup {
  workGroups = "WorkGroups",
}

enum Flag {
  flags = "flags",
}

enum Project {
  projects = "projects",
  userProjects = "projects/userProjects",
}

enum Ticket {
  tickets = "tickets",
  changeTicketStatus = "tickets/ChangeStatus",
  TicketRevisions = "TicketRevisions/Ticket",
}

export const ENDPIONTS = {
  User,
  Invoice,
  Role,
  Project,
  Ticket,
  WorkGroup,
  Flag
};
