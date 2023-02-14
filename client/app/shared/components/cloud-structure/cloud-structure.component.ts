import { filter, map, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DndDropEvent } from 'ngx-drag-drop';
import { Folder, Document, UserStatistics } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { DocumentsService, FoldersService, utilsService } from '@app/shared/services';
import { UsersService } from '@app/components/users/services';
import { ShareComponent } from '../share/share.component';
import { DocumentEditorComponent } from './../document-editor/document-editor.component';
import { CLOUD_STRUCTURE_DROP_EVENTS_TYPES, CLOUD_STRUCTURE_MODES } from './cloud-structure.config';

/**
 * переделать favourite = true на моды
 * моды для cloud-structure вынести в константы
 * покрыть правами методы на бэке
 * добавить изменение названия файлов и папок
 */

import {
  getMaterialFileIcon,
  getMaterialFolderIcon,
} from 'file-extension-icon-js';

@Component({
  selector: 'app-cloud-structure',
  templateUrl: './cloud-structure.component.html',
  styleUrls: ['./cloud-structure.component.scss'],
})
export class CloudStructureComponent implements OnInit, OnChanges, OnDestroy {

  private subscriptions = new Subscription();

  @Input() folders: Folder[] = [];
  @Input() documents: Document[] = [];
  @Input() parent: number = null;
  @Input() disableActions: boolean = false;
  @Input() mode: string = null;

  selectedFolder: Folder = null;
  selectedDocument: Document = null;
  nestedFolders: Folder[] = [];
  userStatistics: UserStatistics = null;
  uploadProgress = 0;
  isHover = false;

  getFolderIcon = getMaterialFolderIcon;
  getFileIcon = getMaterialFileIcon;

  constructor(
    private foldersService: FoldersService,
    private documentsService: DocumentsService,
    private userService: UsersService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  get structureStatistics(): string {
    const folders = utilsService.getQuantitativeDeclinationString(this.folders?.length, ['папка', 'папки', 'папок']);
    const document = utilsService.getQuantitativeDeclinationString(this.documents?.length, ['документ', 'документа', 'документов']);

    return `${folders}, ${document}`;
  }

  getFolderFromList(id: number): Folder {
    return this.folders.find((el: Folder) => Number(el.id) === Number(id));
  }

  getDocumentFromList(id: number): Document {
    return this.documents.find((el: Document) => Number(el.id) === Number(id));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.parent?.currentValue) {
      this.foldersService.getNestedFolders(Number(changes.parent.currentValue)).subscribe({
        next: (nestedFolders: Folder[]) => this.nestedFolders = nestedFolders,
        error: (error: Error) => this.onError(error)
      });
    }
  }

  ngOnInit(): void {
    this.onGetUserStatistics();
  }

  onGetUserStatistics(): void {
    if (this.mode === 'personal') {
      this.userService.getUserStatistics().subscribe({
        next: (statistics: UserStatistics) => this.userStatistics = statistics,
        error: (error: unknown) => this.onError(error)
      });
    }
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
    if (document.extension !== 'doc') {
      return;
    }

    this.dialog.open(DocumentEditorComponent, {
      data: { document },
      width: '80vh',
      minHeight: 'auto',
      disableClose: true
    });
  }

  onClickSetFavoriteDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.documentsService.setDocumentFavorite(document.id).subscribe({
      next: (document: Document) => this.onSettedFavoriteDocument(document),
      error: (error: unknown) => this.onError(error)
    });
  }

  onSettedFavoriteDocument(document: Document): void {
    const needlyDocument = this.getDocumentFromList(document.id);

    if (needlyDocument) {
      needlyDocument.favorite = !Boolean(needlyDocument.favorite);

      if (this.mode === CLOUD_STRUCTURE_MODES.FAVORITES) {
        this.documents = this.documents.filter((el: Document) => el.favorite);
      }

      const message = needlyDocument.favorite ? 'Файл успешно добавлен в избранное' : 'Файл успешно удален из избранного';

      this.notificationService.success(message);
    }
  }

  onClickDeleteDocument(event: Event, document: Document): void {
    event.stopPropagation();

    this.documentsService.deleteDocument(document.id).subscribe({
      next: () => this.onDeletedDocument(document),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDeletedDocument(document: Document): void {
    this.documents = this.documents.filter((el: Document) => Number(el.id) !== Number(document.id));

    this.notificationService.success('Файл успешно удален');

    this.onGetUserStatistics();
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

  onClickSetFavoriteFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.foldersService.setFolderFavorite(folder.id).subscribe({
      next: (folder: Folder) => this.onSettedFavoriteFolder(folder),
      error: (error: unknown) => this.onError(error)
    });
  }

  onSettedFavoriteFolder(folder: Folder): void {
    const needlyFolder = this.getFolderFromList(folder.id);

    if (needlyFolder) {
      needlyFolder.favorite = !Boolean(needlyFolder.favorite);

      if (this.mode === CLOUD_STRUCTURE_MODES.FAVORITES) {
        this.folders = this.folders.filter((el: Folder) => el.favorite);
      }

      const message = needlyFolder.favorite ? 'Папка успешно добавлена в избранное' : 'Папка успешно удалена из избранного';

      this.notificationService.success(message);
    }
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

    this.onGetUserStatistics();
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

    if (file) {
      const formData = new FormData();

      formData.append("thumbnail", file);

      this.documentsService.uploadDocument(formData, this.parent)
        .pipe(
          tap((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round((100 / event.total) * event.loaded);
            } else if (event.type == HttpEventType.Response) {
              this.uploadProgress = 0;
            }
          }),
          filter((event: any) => event.type == HttpEventType.Response && event.body),
          map((event: any) => event.body)
        )
        .subscribe({
          next: (document: Document) => this.onUploadedDocument(document),
          error: (error: unknown) => this.onError(error)
        });
    }
  }

  onUploadedDocument(document: Document): void {
    this.documents.push(document);

    this.notificationService.success('Документ успешно загружен');

    this.onGetUserStatistics();
  }

  onClickDownloadFolder(event: Event, folder: Folder): void {
    event.stopPropagation();

    this.foldersService.downloadFolder(folder.id).subscribe({
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

    this.documentsService.downloadDocument(document.id).subscribe({
      next: (data: Blob) => this.onDownloadedDocument(data, document),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDownloadedDocument(data: Blob, document: Document): void {
    saveAs(data, document.name);
    this.notificationService.success('Документ успешно скачан');
  }

  onDropElement(event: DndDropEvent, destFolder: Folder): void {
    if (event && event.data) {
      const { id } = event.data;

      if (event.data.type === CLOUD_STRUCTURE_DROP_EVENTS_TYPES.FOLDER && id === destFolder.id) {
        return;
      }

      if (event.data.type === CLOUD_STRUCTURE_DROP_EVENTS_TYPES.FOLDER) {
        this.onMoveFolder(id, destFolder.id);
      }

      if (event.data.type === CLOUD_STRUCTURE_DROP_EVENTS_TYPES.DOCUMENT) {
        this.onMoveDocument(id, destFolder.id);
      }
    }
  }

  onMoveDocument(id: number, destFolderId: number): void {
    this.documentsService.moveDocument(id, destFolderId).subscribe({
      next: () => this.onMovedDocument(id),
      error: (error: unknown) => this.onError(error)
    })
  }

  onMovedDocument(id: number): void {
    this.documents = this.documents.filter((el: Document) => el.id !== id);

    this.notificationService.success('Документ успешно перемещен');
  }

  onMoveFolder(id: number, destFolderId: number): void {
    this.foldersService.moveFolder(id, destFolderId).subscribe({
      next: () => this.onMovedFolder(id),
      error: (error: unknown) => this.onError(error)
    })
  }

  onMovedFolder(id: number): void {
    this.folders = this.folders.filter((el: Folder) => el.id !== id);

    this.notificationService.success('Папка успешно перемещена');
  }

  onError(error: unknown): void {
    console.error(error);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
