export interface Document {
  id?: number;
  name?: string;
  extension?: string;
  owner?: boolean;
  root?: boolean;
  folderId?: number;
  favorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
