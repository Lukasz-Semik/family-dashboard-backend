export interface UserShortDataTypes {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UserRoleDataTypes {
  updater: UserShortDataTypes;
  executor?: UserShortDataTypes;
}
