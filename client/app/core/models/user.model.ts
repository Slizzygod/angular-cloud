export interface User {
  id?: number | null;
  username?: string | null;
  email?: string;
  space?: number;
  permissions?: string[];
  firstName?: string;
  lastName?: string;
  patronymicName?: string;
  createdAt?: string;
  blocked?: boolean;
  exp?: number | null;
}

export interface UserStatistics {
  size: string;
  space: number;
  result: string;
}
