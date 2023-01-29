import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionAuthConfirm, ActionAuthLogin, getAuthenticationError, isAuthenticationLoading } from '@app/core/stores';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  public error$: Observable<any> = this.store.select(getAuthenticationError);
  public loading$: Observable<boolean> = this.store.select(isAuthenticationLoading);

  /**
   * Component state.
   */
  private alive = true;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnDestroy(): void {
    this.alive = false;
  }

  submit() {
    if (this.form.valid) {
      const username: any = this.form.get('username').value;
      const password: any = this.form.get('password').value;

      username.trim();
      password.trim();

      const payload = { username, password };

      this.store.dispatch(new ActionAuthLogin(payload));
    }
  }

  onConfirm() {
    const username: any = this.form.get('username').value.trim();
    const password: any = this.form.get('password').value.trim();

    this.store.dispatch(new ActionAuthConfirm({ username, password }));
  }
}
