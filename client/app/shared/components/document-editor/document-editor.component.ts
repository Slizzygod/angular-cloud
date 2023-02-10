/**
 * https://www.velotio.com/engineering-blog/build-collaborative-editor-using-quill-and-yjs
 * https://docs.yjs.dev/getting-started/a-collaborative-editor
 * https://stackoverflow.com/questions/58701585/how-do-i-fix-this-error-i-get-whenever-i-try-to-register-quill-better-table-with
 * https://stackblitz.com/edit/y-quill-avg9q2?file=index.html,index.ts
*/

import * as Y from 'yjs';

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';
import Quill from 'quill';

import { Document } from '@app/core/models';
import { DocumentsService } from '@app/shared/services';
import { NotificationService } from './../../../core/services/notification.service';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
})
export class DocumentEditorComponent {

  document: Document = null;
  parent: number = null;
  text: string = null;

  provider: WebrtcProvider = null;

  constructor(
    public dialogRef: MatDialogRef<DocumentEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { document: Document, parent: number },
    private notificationService: NotificationService,
    private documentsService: DocumentsService,
  ) {
    this.document = data.document;
    this.parent = data.parent;
  }

  editorCreated(event: Quill): void {
    const ydoc = new Y.Doc();

    this.provider = new WebrtcProvider(`doc-${this.document.id}`, ydoc);
    const ytext = ydoc.getText();
    const binding = new QuillBinding(ytext, event, this.provider.awareness);

    this.onGetDocument();
  }

  onGetDocument(): void {
    this.documentsService.getDocument(this.document.id, this.parent).subscribe({
      next: (text: string) => this.text = text,
      error: (error: unknown) => this.onError(error),
    })
  }

  onClickSave(): void {
    if (this.provider) {
      this.provider.destroy();
    }

    this.documentsService.saveDocument(this.document.id, this.parent, this.text).subscribe({
      next: () => this.onSavedDocument(),
      error: (error: unknown) => this.onError(error),
    })
  }

  onSavedDocument(): void {
    this.notificationService.success('Данные успешно сохранены');

    this.dialogRef.close();
  }

  onClickClose(): void {
    if (this.provider) {
      this.provider.destroy();
    }

    this.dialogRef.close();
  }

  onError(error: any): void {
    this.notificationService.error(error.error);
    console.error(error);
  }
}
