import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Folder, Document } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { DocumentsService, FoldersService } from '@app/shared/services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-joint',
  templateUrl: './joint.component.html',
  styleUrls: ['./joint.component.scss']
})
export class JointComponent {

  folders: Folder[] = [];
  documents: Document[] = [];

  constructor(
    private router: Router,
    private foldersService: FoldersService,
    private documentsService: DocumentsService,
    private notificationService: NotificationService
  ) { }

  getFolderFromList(id: number): Folder {
    return this.folders.find((el: Folder) => Number(el.id ) === Number(id));
  }

  getDocumentFromList(id: number): Folder {
    return this.documents.find((el: Document) => Number(el.id ) === Number(id));
  }

  ngOnInit(): void {
    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      folders: this.foldersService.getFolders(),
      documents: this.documentsService.getDocuments()
    }).subscribe({
      next: ({ folders, documents }) => this.onDataLoaded(folders, documents),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDataLoaded(folders: Folder[], documents: Document[]): void {
    this.folders = folders;
    this.documents = documents;
  }

  onDblClickDocument(document: Document): void {
    // this.router.navigate([`cloud/folders/`, document.id]);
  }

  onAddFavoriteDocument(document: Document): void {
    this.documentsService.setDocumentFavorite(document.id).subscribe({
      next: (folder: Folder) => this.onAddedFavoriteDocument(folder),
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

  onDeleteFavoriteDocument(document: Document): void {
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

    this.notificationService.success('Документ успешно удален из избранного');
  }

  onDeleteDocument(document: Document): void {
    this.documentsService.deleteDocument(document.id).subscribe({
      next: () => this.onDeletedDocument(document),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDeletedDocument(document: Document): void {
    this.documents = this.documents.filter((el: Document) => Number(el.id) !== Number(document.id));

    this.notificationService.success('Документ успешно удален');
  }

  onDblClickFolder(folder: Folder): void {
    this.router.navigate([`cloud/folders/`, folder.id]);
  }

  onAddFavoriteFolder(folder: Folder): void {
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

  onDeleteFavoriteFolder(folder: Folder): void {
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

  onDeleteFolder(folder: Folder): void {
    this.foldersService.deleteFolder(folder.id).subscribe({
      next: () => this.onDeletedFolder(folder),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDeletedFolder(folder: Folder): void {
    this.folders = this.folders.filter((el: Folder) => Number(el.id) !== Number(folder.id));

    this.notificationService.success('Папка успешно удалена');
  }

  onError(error: unknown): void {
    console.error(error);
  }

}
