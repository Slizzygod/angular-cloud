export interface User {
  id?: number | null;
  username?: string | null;
  email?: string;
  permissions: string[];
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  exp: number | null;
}
