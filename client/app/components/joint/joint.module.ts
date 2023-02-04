import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JointRoutingModule } from './joint-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { JointComponent } from './joint.component';

@NgModule({
  declarations: [JointComponent],
  providers: [],
  imports: [RouterModule, CommonModule, JointRoutingModule, SharedModule],
})
export class JointModule {}
