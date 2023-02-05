import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Folder } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { FoldersService } from '@app/shared/services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-joint',
  templateUrl: './joint.component.html',
  styleUrls: ['./joint.component.scss']
})
export class JointComponent {

  folders: Folder[] = [];

  constructor(
    private router: Router,
    private foldersService: FoldersService,
    private notificationService: NotificationService
  ) { }

  getFolderFromList(id: number): Folder {
    return this.folders.find((el: Folder) => Number(el.id ) === Number(id));
  }

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
