import { Folder, User } from '@app/core/models';

export interface Log {
  id?: number;
  alias?: string;
  method?: string;
  data?: any;
  userId?: number;
  folderId?: number;
  documentId?: any;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  folder?: Folder;
}
