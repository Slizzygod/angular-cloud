import { Component } from '@angular/core';
import { Folder, Document } from '@app/core/models';
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
    private foldersService: FoldersService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      folders: this.foldersService.getFolders({ joint: true }),
      documents: this.documentsService.getDocuments({ joint: true })
    }).subscribe({
      next: ({ folders, documents }) => this.onDataLoaded(folders, documents),
      error: (error: unknown) => this.onError(error)
    })
  }

  onDataLoaded(folders: Folder[], documents: Document[]): void {
    this.folders = folders;
    this.documents = documents;
  }

  onError(error: any): void {
    console.error(error);
  }

}
