import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { UsersService } from '@app/components/users/services';
import { User } from '@app/core/models';
import { Subscription } from 'rxjs';
import { getAuthenticatedUser } from '@app/core/stores';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  users: User[] = [];
  currentUser: User = null;

  currentUser$ = this.store.pipe(select(getAuthenticatedUser));

  constructor(
    public dialogRef: MatDialogRef<ShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { shared: number[] },
    private store: Store,
    private usersService: UsersService
  ) {
    this.subscriptions.add(
      this.store.pipe(select(getAuthenticatedUser)).subscribe({
        next: (user: any) => this.currentUser = user
      })
    );
  }

  ngOnInit() {
    this.onGetData();
  }

  onGetData(): void {
    this.usersService.getUsers().subscribe({
      next: (users: User[]) => this.onDataLoaded(users),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDataLoaded(users: User[]): void {
    this.users = users
      .filter((el: User) => el.id !== this.currentUser.id)
      .map((user: User) => ({ ...user, state: this.data.shared.includes(user.id) }));
  }

  onChangeUserState(event: MatCheckboxChange, user: User): void {
    const checked = event.checked;
    user['state'] = checked;
  }

  onClickSave(): void {
    const needlyUsers = this.users
      .filter((user: User) => user['state'])
      .map((user: User) => user.id);

    this.dialogRef.close(needlyUsers);
  }

  onError(error: any) {
    console.log(error);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
