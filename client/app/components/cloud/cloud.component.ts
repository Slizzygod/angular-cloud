import { getMaterialFileIcon, getMaterialFolderIcon } from "file-extension-icon-js";

import { NotificationService } from './../../core/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { Folder } from '@app/core/models';
import { forkJoin } from 'rxjs';
import { FoldersService } from '../../shared/services';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.scss']
})
export class CloudComponent implements OnInit {

  folders: Folder[] = [];

  getFolderIcon = getMaterialFolderIcon;
  getFileIcon = getMaterialFileIcon;

  constructor(
    private foldersService: FoldersService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      folders: this.foldersService.getFolders()
    }).subscribe({
      next: ({ folders }) => this.onDataLoaded(folders),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDataLoaded(folders: Folder[]): void {
    this.folders = folders;
  }

  onClickCreateFolder(): void {
    const folder = {
      name: `Новая папка ${this.folders.length + 1}`,
      root: true
    };

    this.foldersService.createFolder(folder).subscribe({
      next: (folder: Folder) => this.onCreatedFolder(folder),
      error: (error: unknown) => this.onError(error)
    })
  }

  onCreatedFolder(folder: Folder): void {
    this.folders.push(folder);

    this.notificationService.success('Папка успешно создана');
  }

  onClickCreateDocument(): void {

  }

  onError(error: unknown): void {
    console.error(error);
  }

}
