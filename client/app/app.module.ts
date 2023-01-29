import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CloudComponent } from './cloud/cloud.component';
import { JointComponent } from './joint/joint.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { UploadComponent } from './upload/upload.component';
import { SettingsComponent } from './settings/settings.component';
import { StaticModule } from './static/static.modue';

@NgModule({
    declarations: [
      AppComponent,
      CloudComponent,
      JointComponent,
      FavoritesComponent,
      UploadComponent,
      SettingsComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
      StaticModule,
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      SharedModule,
      CoreModule,
    ]
})
export class AppModule { }
