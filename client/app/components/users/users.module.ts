import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { UsersSettingsComponent, GroupsSettingsComponent } from './components';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [
    UsersComponent,
    UsersSettingsComponent,
    GroupsSettingsComponent,
  ],
  providers: [],
  imports: [RouterModule, CommonModule, UsersRoutingModule, SharedModule],
})
export class UsersModule {}
