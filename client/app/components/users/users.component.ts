import { Component, OnInit } from '@angular/core';

import { forkJoin } from 'rxjs';

import { UsersService } from './services';
import { NotificationService } from '@app/core/services';

import { User, Group } from '@app/core/models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  groups: Group[] = [];

  constructor(
    private usersService: UsersService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.onGetData();
  }

  onGetData(): void {
    forkJoin({
      users: this.usersService.getUsers(),
      groups: this.usersService.getGroups()
    }).subscribe({
      next: ({ users, groups }) => this.onDataLoaded(users, groups),
      error: error => this.onError(error)
    });
  }

  onDataLoaded(users: User[], groups: Group[]): void {
    this.users = users;
    this.groups = groups;
  }

  onUpdatedUser(user: User): void {
    const needlyUserIndex = this.users.findIndex(el => user.id === user.id);

    if (needlyUserIndex !== -1) {
      this.users[needlyUserIndex] = { ...this.users[needlyUserIndex], ...user };
    }
  }

  onError(error: any): void {
    this.notificationService.error(error.error);
    console.error(error);
  }

}
