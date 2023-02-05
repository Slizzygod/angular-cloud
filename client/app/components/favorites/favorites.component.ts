import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Folder } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { FoldersService } from '@app/shared/services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  folders: Folder[] = [];

  constructor(
    private router: Router,
    private foldersService: FoldersService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      folders: this.foldersService.getFolders({ favorites: true })
    }).subscribe({
      next: ({ folders }) => this.onDataLoaded(folders),
      error: (error: unknown) => this.onError(error)
    })
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

  onDataLoaded(folders: Folder[]): void {
    this.folders = folders;
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
