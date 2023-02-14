import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { User } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { UsersSettingsService } from './services';

@Component({
  selector: 'app-users-settings',
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss']
})
export class UsersSettingsComponent implements OnChanges {

  @Input() users: User[] = [];
  @Output() updateUser: EventEmitter<User> = new EventEmitter<User>();

  selectedUser: User = null;

  form: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    patronymicName: new FormControl(''),
    space: new FormControl()
  });

  constructor(
    private usersSettingsService: UsersSettingsService,
    private notificationService: NotificationService
  ) { }

  ngOnChanges() {
    this.sortUsers()
  }

  onClickUser(user: User): void {
    if (this.selectedUser && user.id === this.selectedUser.id) {
      return;
    }

    this.selectedUser = user;

    this.form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      patronymicName: user.patronymicName,
      space: user.space,
    })
  }

  onClickBlockButton(): void {
    this.selectedUser.blocked ? this.onClickUnlockUser() : this.onClickBlockUser();
  }

  onClickBlockUser(): void {
    this.usersSettingsService.blockUser(this.selectedUser.id).subscribe({
      next: () => this.onBlockedUser(),
      error: (error: unknown) => this.onError(error)
    })
  }

  onBlockedUser(): void {
    const needlyUserIndex = this.users.findIndex(user => user.id === this.selectedUser.id);

    if (needlyUserIndex !== -1) {
      this.users[needlyUserIndex].blocked = true;
      this.updateUser.emit(this.users[needlyUserIndex]);
    }

    this.selectedUser.blocked = true;

    this.sortUsers();

    this.notificationService.success('Пользователь успешно заблокирован');
  }

  onClickUnlockUser(): void {
    this.usersSettingsService.unlockUser(this.selectedUser.id).subscribe({
      next: () => this.onUnlockedUser(),
      error: (error: unknown) => this.onError(error)
    })
  }

  onUnlockedUser(): void {
    const needlyUserIndex = this.users.findIndex(user => user.id === this.selectedUser.id);

    if (needlyUserIndex !== -1) {
      this.users[needlyUserIndex].blocked = false;
      this.updateUser.emit(this.users[needlyUserIndex]);
    }

    this.selectedUser.blocked = false;

    this.sortUsers();

    this.notificationService.success('Пользователь успешно разблокирован');
  }

  onClickSave(): void {
    const user = {
      id: this.selectedUser.id,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      patronymicName: this.form.get('patronymicName').value,
      space: this.form.get('space').value,
    };

    this.usersSettingsService.updateUser(user).subscribe({
      next: () => this.onSavedUser(user),
      error: (error: unknown) => this.onError(error)
    })
  }

  onSavedUser(user: User): void {
    this.updateUser.emit(user);

    this.notificationService.success('Данные пользователя успешно обновлены');
  }

  sortUsers(): void {
    this.users.sort((a: User, b: User) => Number(a.blocked) - Number(b.blocked));
  }

  onError(error: any): void {
    console.error(error);
  }

}
