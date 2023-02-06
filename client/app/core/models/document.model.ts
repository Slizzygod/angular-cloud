export interface Document {
  id?: number;
  name?: string;
  extension?: string;
  owner?: boolean;
  shared?: number[];
  root?: boolean;
  folderId?: number;
  favorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
