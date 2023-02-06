import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Folder, Document } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { forkJoin, Subscription } from 'rxjs';
import { FoldersService, DocumentsService } from '../../shared/services';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.scss']
})
export class CloudComponent implements OnInit {

  private subscriptions = new Subscription();

  folders: Folder[] = [];
  documents: Document[] = [];
  parent: number = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foldersService: FoldersService,
    private documentService: DocumentsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe({
        next: (params) => this.onParamsLoaded(params),
        error: (error) => this.onError(error),
      })
    );
  }

  getFolderFromList(id: number): Folder {
    return this.folders.find((el: Folder) => Number(el.id) === Number(id));
  }

  getDocumentFromList(id: number): Document {
    return this.documents.find((el: Document) => Number(el.id) === Number(id));
  }

  onParamsLoaded(params: Params): void {
    this.parent = params['id'];

    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      folders: this.foldersService.getFolders({ parentId: this.parent, owner: !this.parent && true }),
      documents: this.documentService.getDocuments({ owner: true, folderId: this.parent })
    }).subscribe({
      next: ({ folders, documents }) => this.onDataLoaded(folders, documents),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDataLoaded(folders: Folder[], documents: Document[]): void {
    this.folders = folders;
    this.documents = documents;
  }

  onCreateDocument(): void {
    const document = {
      name: `Новый файл ${this.documents.length + 1}`,
      root: !this.parent ? true : false,
      extension: 'doc',
      folderId: this.parent
    };

    this.documentService.createDocument(document).subscribe({
      next: (document: Document) => this.onCreatedDocument(document),
      error: (error: unknown) => this.onError(error)
    })
  }

  onCreatedDocument(document: Document): void {
    this.documents.push(document);

    this.notificationService.success('Докумень успешно создан');
  }

  onDblClickDocument(document: Document): void {
    // this.router.navigate([`cloud/folders/`, folder.id]);
  }

  onAddFavoriteDocument(document: Document): void {
    this.documentService.setDocumentFavorite(document.id).subscribe({
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

  onDeleteFavoriteDocument(document: Document): void {
    this.documentService.deleteDocumentFavorite(document.id).subscribe({
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

  onDeleteDocument(document: Document): void {
    this.documentService.deleteDocument(document.id).subscribe({
      next: () => this.onDeletedDocument(document),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDeletedDocument(document: Document): void {
    this.documents = this.documents.filter((el: Document) => Number(el.id) !== Number(document.id));

    this.notificationService.success('Файл успешно удален');
  }

  onCreateFolder(): void {
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
