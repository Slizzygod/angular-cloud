import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Folder, Document } from '@app/core/models';
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
    private foldersService: FoldersService,
    private documentService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe({
        next: (params) => this.onParamsLoaded(params),
        error: (error) => this.onError(error),
      })
    );
  }

  onParamsLoaded(params: Params): void {
    this.parent = params['id'];

    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      folders: this.foldersService.getFolders({ parentId: this.parent, owner: !this.parent && true }),
      documents: this.documentService.getDocuments({ folderId: this.parent, owner: !this.parent && true,  })
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
