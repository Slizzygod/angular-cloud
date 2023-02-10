import { Component, OnInit, Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '@app/components/users/services';
import { User } from '@app/core/models';
import { NotificationService } from '@app/core/services';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  users: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { shared: number[] },
    private usersService: UsersService,
    private notificationService: NotificationService
  ) { }

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
    this.users = users.map((user: User) => ({ ...user, state: this.data.shared.includes(user.id) }));
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
    this.notificationService.error(error.error);
    console.log(error);
  }

}
