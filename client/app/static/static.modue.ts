import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { StaticRoutingModule } from './static-routing.module';
import { LoginComponent, LogoutComponent } from './components';

@NgModule({
  imports: [SharedModule, StaticRoutingModule],
  declarations: [LoginComponent, LogoutComponent],
})
export class StaticModule {}
