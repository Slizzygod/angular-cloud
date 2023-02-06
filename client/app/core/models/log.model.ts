import { Folder, Document, User } from '@app/core/models';

export interface Log {
  id?: number;
  alias?: string;
  method?: string;
  data?: any;
  user?: User;
  folder?: Folder;
  document?: Document;
  createdAt?: string;
  updatedAt?: string;
}
