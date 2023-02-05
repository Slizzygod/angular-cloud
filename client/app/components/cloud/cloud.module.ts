import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CloudRoutingModule } from './cloud-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { CloudComponent } from './cloud.component';

@NgModule({
  declarations: [CloudComponent],
  providers: [],
  imports: [RouterModule, CommonModule, CloudRoutingModule, SharedModule],
})
export class CloudModule {

  constructor() { }

}
