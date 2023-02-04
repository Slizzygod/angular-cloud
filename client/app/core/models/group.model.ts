import { User } from "./user.model";

export interface Group {
  id?: number;
  name?: string;
  shortName?: string;
  note?: string;
  users?: any[]
}
