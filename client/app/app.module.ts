import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { StaticModule } from './static/static.modue';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import {
  CloudComponent,
  JointComponent,
  FavoritesComponent,
  UploadComponent,
  SettingsComponent,
  UsersComponent,
  LogsComponent,
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    CloudComponent,
    JointComponent,
    FavoritesComponent,
    UploadComponent,
    SettingsComponent,
    UsersComponent,
    LogsComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    StaticModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
  ],
})
export class AppModule {}
