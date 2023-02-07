import { saveAs } from 'file-saver';

import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Folder, Document } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { DocumentsService, FoldersService } from '@app/shared/services';
import { ShareComponent } from '../share/share.component';
import { DocumentEditorComponent } from './../document-editor/document-editor.component';

import {
  getMaterialFileIcon,
  getMaterialFolderIcon,
} from 'file-extension-icon-js';

@Component({
  selector: 'app-cloud-structure',
  templateUrl: './cloud-structure.component.html',
  styleUrls: ['./cloud-structure.component.scss'],
})
export class CloudStructureComponent implements OnDestroy {

  private subscriptions = new Subscription();

  @Input() folders: Folder[] = [];
  @Input() documents: Document[] = [];
  @Input() parent: number = null;
  @Input() disableActions: boolean = false;

  selectedFolder: Folder = null;
  selectedDocument: Document = null;
  isHover = false;

  getFolderIcon = getMaterialFolderIcon;
  getFileIcon = getMaterialFileIcon;

  constructor(
    private foldersService: FoldersService,
    private documentsService: DocumentsService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  getFolderFromList(id: number): Folder {
    return this.folders.find((el: Folder) => Number(el.id) === Number(id));
  }

  getDocumentFromList(id: number): Document {
    return this.documents.find((el: Document) => Number(el.id) === Number(id));
  }

  onClickDocument(document: Document): void {
    this.selectedDocument = document;
    this.selectedFolder = null;
  }

  onClickFolder(folder: Folder): void {
    this.selectedFolder = folder;
    this.selectedDocument = null;
  }

  onClickCreateDocument(): void {
    const document = {
      name: `Новый файл ${this.documents.length + 1}`,
      root: !this.parent ? true : false,
      extension: 'doc',
      folderId: this.parent
    };

    this.documentsService.createDocument(document).subscribe({
      next: (document: Document) => this.onCreatedDocument(document),
      error: (error: unknown) => this.onError(error)
    })
  }

  onCreatedDocument(document: Document): void {
    this.documents.push(document);

    this.notificationService.success('Докумень успешно создан');
  }

  onDblClickDocument(document: Document): void {
    const dialogRef = this.dialog.open(DocumentEditorComponent, {
      data: { document, parent: this.parent },
      width: '80vh',
      minHeight: 'auto',
      disableClose: true
    });
  }

  onClickAddFavoriteDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.documentsService.setDocumentFavorite(document.id).subscribe({
      next: (document: Document) => this.onAddedFavoriteDocument(document),
      error: (error: unknown) => this.onError(error)
    });
  }

  onAddedFavoriteDocument(document: Document): void {
    const needlyDocument = this.getDocumentFromList(document.id);

    if (needlyDocument) {
      needlyDocument.favorite = true;
    }

    this.notificationService.success('Файл успешно добавлен в избранное');
  }

  onClickDeleteFavoriteDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.documentsService.deleteDocumentFavorite(document.id).subscribe({
      next: (document: Document) => this.onDeletedFavoriteDocument(document),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDeletedFavoriteDocument(document: Document): void {
    const needlyDocument = this.getDocumentFromList(document.id);

    if (needlyDocument) {
      needlyDocument.favorite = false;
    }

    this.notificationService.success('Файл успешно удален из избранного');
  }

  onClickDeleteDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.documentsService.deleteDocument(document.id, this.parent).subscribe({
      next: () => this.onDeletedDocument(document),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDeletedDocument(document: Document): void {
    this.documents = this.documents.filter((el: Document) => Number(el.id) !== Number(document.id));

    this.notificationService.success('Файл успешно удален');
  }

  onClickCreateFolder(): void {
    const folder = {
      name: `Новая папка ${this.folders.length + 1}`,
      root: !this.parent ? true : false,
      parentId: this.parent
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

  onDblClickFolder(folder: Folder): void {
    this.router.navigate([`cloud/folders/`, folder.id]);
  }

  onClickAddFavoriteFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.foldersService.setFolderFavorite(folder.id).subscribe({
      next: (folder: Folder) => this.onAddedFavoriteFolder(folder),
      error: (error: unknown) => this.onError(error)
    });
  }

  onAddedFavoriteFolder(folder: Folder): void {
    const needlyFolder = this.getFolderFromList(folder.id);

    if (needlyFolder) {
      needlyFolder.favorite = true;
    }

    this.notificationService.success('Папка успешно добавлена в избранное');
  }

  onClickDeleteFavoriteFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.foldersService.deleteFolderFavorite(folder.id).subscribe({
      next: (folder: Folder) => this.onDeletedFavoriteFolder(folder),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDeletedFavoriteFolder(folder: Folder): void {
    const needlyFolder = this.getFolderFromList(folder.id);

    if (needlyFolder) {
      needlyFolder.favorite = false;
    }

    this.notificationService.success('Папка успешно удалена из избранного');
  }

  onClickDeleteFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.foldersService.deleteFolder(folder.id).subscribe({
      next: () => this.onDeletedFolder(folder),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDeletedFolder(folder: Folder): void {
    this.folders = this.folders.filter((el: Folder) => Number(el.id) !== Number(folder.id));

    this.notificationService.success('Папка успешно удалена');
  }

  onClickShare(mode: 'folder' | 'document', entity: Folder | Document): void {
    const dialogRef = this.dialog.open(ShareComponent, {
      data: { shared: entity.shared },
      width: '40vh',
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe({
        next: (users: number[]) => this.onShare(users, mode, entity),
        error: (error: unknown) => this.onError(error)
      })
    );
  }

  onShare(users: number[], mode: 'folder' | 'document', entity: Folder | Document): void {
    if (users) {
      if (mode === 'folder') {
        this.foldersService.shareFolder(entity.id, users).subscribe({
          next: () => this.onShared(users, entity),
          error: (error: unknown) => this.onError(error)
        });
      }

      if (mode === 'document') {
        this.documentsService.shareDocument(entity.id, users).subscribe({
          next: () => this.onShared(users, entity),
          error: (error: unknown) => this.onError(error)
        });
      }
    }
  }

  onShared(users: number[], entity: Folder | Document): void {
    entity.shared = users;

    this.notificationService.success('Успешно расшарено');
  }

  onClickUploadFile(event: any): void {
    const file: File = event.target.files[0];
    console.log(file)
    if (file) {
      const formData = new FormData();

      formData.append("thumbnail", file);

      this.documentsService.uploadDocument(formData, this.parent).subscribe({
        next: (document: Document) => this.onUploadedDocument(document),
        error: (error: unknown) => this.onError(error)
      });
    }
  }

  onUploadedDocument(document: Document): void {
    this.documents.push(document);

    this.notificationService.success('Документ успешно загружен');
  }

  onClickDownloadFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.foldersService.downloadFolder(folder.id, this.parent).subscribe({
      next: (data: Blob) => this.onDownloadedFolder(data, folder),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDownloadedFolder(data: Blob, folder: Folder): void {
    saveAs(data, folder.name);
    this.notificationService.success('Архив успешно скачан');
  }

  onClickDownloadDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.documentsService.downloadDocument(document.id, this.parent).subscribe({
      next: (data: Blob) => this.onDownloadedDocument(data, document),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDownloadedDocument(data: Blob, document: Document): void {
    saveAs(data, document.name);
    this.notificationService.success('Документ успешно скачан');
  }

  onError(error: unknown): void {
    console.error(error);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
