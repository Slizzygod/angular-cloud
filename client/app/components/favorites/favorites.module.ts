import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FavoritesRoutingModule } from './favorites-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { FavoritesComponent } from './favorites.component';

@NgModule({
  declarations: [FavoritesComponent],
  providers: [],
  imports: [RouterModule, CommonModule, FavoritesRoutingModule, SharedModule],
})
export class FavoritesModule {}
