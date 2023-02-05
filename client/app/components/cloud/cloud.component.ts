import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Folder } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { forkJoin, Subscription } from 'rxjs';
import { FoldersService } from '../../shared/services';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.scss']
})
export class CloudComponent implements OnInit {

  private subscriptions = new Subscription();

  folders: Folder[] = [];
  parent: number = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foldersService: FoldersService,
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
    return this.folders.find((el: Folder) => Number(el.id ) === Number(id));
  }

  onParamsLoaded(params: Params): void {
    this.parent = params['id'];

    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      folders: this.foldersService.getFolders({ parentId: this.parent, owner: !this.parent && true })
    }).subscribe({
      next: ({ folders }) => this.onDataLoaded(folders),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDataLoaded(folders: Folder[]): void {
    this.folders = folders;
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

  onCreateDocument(): void {

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
