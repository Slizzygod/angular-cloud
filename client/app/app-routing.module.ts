import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/stores';
import { ProxyComponent } from './static/components';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: ProxyComponent,
    pathMatch: 'full'
  },
  {
    canActivate: [AuthGuardService],
    path: 'cloud',
    loadChildren: () => import('./cloud/cloud.module').then(m => m.CloudModule),
    data: {
      title: 'Мое облако',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'joint',
    loadChildren: () => import('./joint/joint.module').then(m => m.JointModule),
    data: {
      title: 'Общедоступное',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesModule),
    data: {
      title: 'Избранное',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule),
    data: {
      title: 'Загрузка',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    data: {
      title: 'Настройки',
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
