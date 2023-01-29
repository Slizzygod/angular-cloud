import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, LogoutComponent } from './components';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Вход в систему' }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: { title: 'Выход из системы' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule {}
