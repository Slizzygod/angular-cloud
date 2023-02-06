import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Folder, Document } from '@app/core/models';

import {
  getMaterialFileIcon,
  getMaterialFolderIcon,
} from 'file-extension-icon-js';

@Component({
  selector: 'app-cloud-structure',
  templateUrl: './cloud-structure.component.html',
  styleUrls: ['./cloud-structure.component.scss'],
})
export class CloudStructureComponent {

  @Input() folders: Folder[] = [];
  @Input() documents: Document[] = [];
  @Input() disableActions: boolean = false;

  @Output() createDocument: EventEmitter<Document> = new EventEmitter();
  @Output() dblClickDocument: EventEmitter<Document> = new EventEmitter();
  @Output() addFavoriteDocument: EventEmitter<Document> = new EventEmitter();
  @Output() deleteFavoriteDocument: EventEmitter<Document> = new EventEmitter();
  @Output() deleteDocument: EventEmitter<Document> = new EventEmitter();

  @Output() createFolder: EventEmitter<Folder> = new EventEmitter();
  @Output() dblClickFolder: EventEmitter<Folder> = new EventEmitter();
  @Output() addFavoriteFolder: EventEmitter<Folder> = new EventEmitter();
  @Output() deleteFavoriteFolder: EventEmitter<Folder> = new EventEmitter();
  @Output() deleteFolder: EventEmitter<Folder> = new EventEmitter();

  selectedFolder: Folder = null;
  selectedDocument: Document = null;
  isHover = false;

  getFolderIcon = getMaterialFolderIcon;
  getFileIcon = getMaterialFileIcon;

  constructor() {}

  onClickCreateDocument(): void {
    this.createDocument.emit();
  }


  onDblClickDocument(document: Document): void {
    this.dblClickDocument.emit(document);
  }

  onClickDocument(document: Document): void {
    this.selectedDocument = document;
    this.selectedFolder = null;
  }

  onClickAddFavoriteDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.addFavoriteDocument.emit(document);
  }

  onClickDeleteFavoriteDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.deleteFavoriteDocument.emit(document);
  }

  onClickDeleteDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.deleteDocument.emit(document);
  }

  onClickCreateFolder(): void {
    this.createFolder.emit();
  }

  onDblClickFolder(folder: Folder): void {
    this.dblClickFolder.emit(folder);
  }

  onClickFolder(folder: Folder): void {
    this.selectedFolder = folder;
    this.selectedDocument = null;
  }

  onClickAddFavoriteFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.addFavoriteFolder.emit(folder);
  }

  onClickDeleteFavoriteFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.deleteFavoriteFolder.emit(folder);
  }

  onClickDeleteFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.deleteFolder.emit(folder);
  }

}
