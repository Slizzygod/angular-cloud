import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Folder, Document } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { DocumentsService, FoldersService } from '@app/shared/services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  folders: Folder[] = [];
  documents: Document[] = [];

  constructor(
    private router: Router,
    private foldersService: FoldersService,
    private documentsService: DocumentsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      folders: this.foldersService.getFolders({ favorites: true }),
      documents: this.documentsService.getDocuments({ favorites: true })
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

  onDeleteFavoriteDocument(document: Document): void {
    this.documentsService.deleteDocumentFavorite(document.id).subscribe({
      next: (document: Document) => this.onDeletedFavoriteDocument(document),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDeletedFavoriteDocument(document: Document): void {
    this.documents = this.documents.filter((el: Document) => Number(el.id) !== Number(document.id));

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

    this.notificationService.success('Документ успешно удмален');
  }

  onDblClickFolder(folder: Folder): void {
    this.router.navigate([`cloud/folders/`, folder.id]);
  }

  onDeleteFavoriteFolder(folder: Folder): void {
    this.foldersService.deleteFolderFavorite(folder.id).subscribe({
      next: (folder: Folder) => this.onDeletedFavoriteFolder(folder),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDeletedFavoriteFolder(folder: Folder): void {
    this.folders = this.folders.filter((el: Folder) => Number(el.id) !== Number(folder.id));

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
