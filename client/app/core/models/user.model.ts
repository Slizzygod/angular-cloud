export interface User {
  id?: number | null;
  username?: string | null;
  email?: string;
  permissions?: string[];
  firstName?: string;
  lastName?: string;
  patronymicName?: string;
  createdAt?: string;
  blocked?: boolean;
  exp?: number | null;
}
