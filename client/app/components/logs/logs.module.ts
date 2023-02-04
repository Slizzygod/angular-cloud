import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogsRoutingModule } from './logs-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { LogsComponent } from './logs.component';

@NgModule({
  declarations: [LogsComponent],
  providers: [],
  imports: [RouterModule, CommonModule, LogsRoutingModule, SharedModule],
})
export class LogsModule {}
