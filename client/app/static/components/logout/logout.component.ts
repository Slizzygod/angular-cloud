import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { AuthActionTypes } from '@app/core/stores';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private store: Store) {
    this.store.dispatch({ type: AuthActionTypes.LOGOUT });
  }

}
