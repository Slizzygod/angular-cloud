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
  @Input() folders: Folder[];

  @Output() createDocument: EventEmitter<Folder> = new EventEmitter();
  @Output() createFolder: EventEmitter<Folder> = new EventEmitter();

  getFolderIcon = getMaterialFolderIcon;
  getFileIcon = getMaterialFileIcon;

  onClickCreateDocument(): void {
    this.createDocument.emit();
  }

  onClickCreateFolder(): void {
    this.createFolder.emit();
  }
}
