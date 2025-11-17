export const Roles = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

export type RoleType = typeof Roles[keyof typeof Roles];
