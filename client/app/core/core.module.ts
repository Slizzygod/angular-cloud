import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { ErrorHandlerService } from './services/error-handler.service';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './core.state';
import { AuthEffects, AuthGuardService } from './stores';
import { JwtModule } from '@auth0/angular-jwt';
import { LocalStorageService, PermsGuardService } from './services';
import { EffectsModule } from '@ngrx/effects';
import { NotificationService } from './services/notification.service';
import { HttpErrorInterceptor } from './services/http-error-interceptor';

export function tokenGetter() {
  const storage = new LocalStorageService;
  return storage.getItem('TOKEN');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,

    StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
    EffectsModule.forRoot([AuthEffects]),

    JwtModule.forRoot({ config: { tokenGetter } }),
    SharedModule,
  ],
  providers: [
    AuthGuardService,
    NotificationService,
    PermsGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
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
