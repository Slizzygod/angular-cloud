import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { UploadRoutingModule } from './upload-routing.module';

import { UploadComponent } from './upload.component';

@NgModule({
  declarations: [UploadComponent],
  providers: [],
  imports: [RouterModule, CommonModule, UploadRoutingModule, SharedModule],
})
export class UploadModule {}
