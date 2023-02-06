import { Component } from '@angular/core';
import { Folder, Document } from '@app/core/models';
import { DocumentsService, FoldersService, utilsService } from '@app/shared/services';
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
    private documentsService: DocumentsService,
  ) { }

  getInfo(): string {
    const folders = utilsService.getQuantitativeDeclinationString(this.folders.length, ['папка', 'папки', 'папок']);
    const document = utilsService.getQuantitativeDeclinationString(this.documents.length, ['документ', 'документа', 'документов']);

    return `${folders}, ${document}`;
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

  onError(error: unknown): void {
    console.error(error);
  }

}
