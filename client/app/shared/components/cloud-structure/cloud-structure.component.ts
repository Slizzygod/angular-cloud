import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Folder } from '@app/core/models';

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
  @Input() disableActions: boolean = false;

  @Output() createDocument: EventEmitter<Folder> = new EventEmitter();
  @Output() createFolder: EventEmitter<Folder> = new EventEmitter();
  @Output() dblClickFolder: EventEmitter<Folder> = new EventEmitter();
  @Output() addFavoriteFolder: EventEmitter<Folder> = new EventEmitter();
  @Output() deleteFavoriteFolder: EventEmitter<Folder> = new EventEmitter();
  @Output() deleteFolder: EventEmitter<Folder> = new EventEmitter();

  selectedFolder: Folder = null;
  isHover = false;

  getFolderIcon = getMaterialFolderIcon;
  getFileIcon = getMaterialFileIcon;

  constructor() {}

  onClickCreateDocument(): void {
    this.createDocument.emit();
  }

  onClickCreateFolder(): void {
    this.createFolder.emit();
  }

  onDblClickFolder(folder: Folder): void {
    this.dblClickFolder.emit(folder);
  }

  onClickFolder(folder: Folder): void {
    this.selectedFolder = folder;
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
