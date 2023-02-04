import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent],
  providers: [],
  imports: [RouterModule, CommonModule, SettingsRoutingModule, SharedModule],
})
export class SettingsModule {}
