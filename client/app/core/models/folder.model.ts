export interface Folder {
  id?: number;
  name?: string;
  favorite?: boolean;
  parentId?: number;
  root?: boolean;
  owner?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
