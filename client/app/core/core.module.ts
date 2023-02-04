import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './core.state';
import { AuthEffects, AuthGuardService } from './stores';
import { JwtModule } from '@auth0/angular-jwt';
import { LocalStorageService, PermsGuardService } from './services';
import { EffectsModule } from '@ngrx/effects';
import { NotificationService } from './services/notification.service';

export function tokenGetter() {
  const storage = new LocalStorageService;
  return storage.getItem('TOKEN');
}

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,

    StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
    EffectsModule.forRoot([AuthEffects]),

    JwtModule.forRoot({ config: { tokenGetter } }),
    SharedModule,
  ],
  providers: [
    AuthGuardService,
    NotificationService,
    PermsGuardService
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
