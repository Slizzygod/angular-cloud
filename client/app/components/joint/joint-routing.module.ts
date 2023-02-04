import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JointComponent } from './joint.component';

const routes: Routes = [{
  path: '',
  component: JointComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JointRoutingModule { }
