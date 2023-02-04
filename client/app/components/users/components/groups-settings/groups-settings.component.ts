import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { GroupsSettingsService } from './services';

import { Group, User } from '@app/core/models';
import { NotificationService } from '@app/core/services';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-groups-settings',
  templateUrl: './groups-settings.component.html',
  styleUrls: ['./groups-settings.component.scss']
})
export class GroupsSettingsComponent {

  @Input() users: User[] = [];
  @Input() groups: Group[] = [];

  selectedGroup: Group = null;

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    shortName: new FormControl(''),
    note: new FormControl(''),
  });

  constructor(
    private groupsSettingsService: GroupsSettingsService,
    private notificationService: NotificationService
  ) {}

  onClickGroup(group: Group): void {
    this.selectedGroup = group;

    this.users = this.users.map((user: User) => ({ ...user, state: !!group.users.find((el: User) => user.id === el.id) }));
    this.users.sort((a: User, b: User) => b['state'] - a['state'])

    this.form.reset({
      name: group.name,
      shortName: group.shortName,
      note: group.note,
    })
  }

  onClickCreateGroup(): void {
    const group = { name: 'Новая группа ' + (this.groups.length + 1) };

    this.groupsSettingsService.createGroup(group).subscribe({
      next: (group: Group) => this.onCreatedGroup(group),
      error: (error: unknown) => this.onError(error)
    });
  }

  onCreatedGroup(group: Group): void {
    group.users = [];

    this.groups.push(group);
    this.onClickGroup(group);
    this.notificationService.success('Группа успешно создана');
  }

  onClickDeleteGroup(): void {
    this.groupsSettingsService.deleteGroup(this.selectedGroup.id).subscribe({
      next: () => this.onDeletedGroup(),
      error: (error: unknown) => this.onError(error)
    });
  }

  onDeletedGroup(): void {
    this.groups = this.groups.filter((group: Group) => group.id !== this.selectedGroup.id);
    this.notificationService.success('Группа успешно удалена');
    this.selectedGroup = null;
  }

  onChangeUserState(event: MatCheckboxChange, userId: number): void {
    const checked = event.checked;
    const user = this.users.find((el: User) => el.id === userId);

    if (user) {
      user['state'] = checked;
    }
  }

  onClickSave(): void {
    const selectedUsers = this.users.filter((user: User) => user['state']).map((user: User) => user.id);
    const group = {
      id: this.selectedGroup.id,
      name: this.form.get('name').value,
      shortName: this.form.get('shortName').value,
      note: this.form.get('note').value,
      users: selectedUsers,
    }

    this.groupsSettingsService.updateGroup(group)
      .subscribe({
        next: () => this.onSavedGroup(group),
        error: (error: unknown) => this.onError(error)
      })
  }

  onSavedGroup(group: Group): void {
    const needlyGroupIndex = this.groups.findIndex((el: Group) => el.id === group.id);

    if (needlyGroupIndex !== -1) {
      this.groups[needlyGroupIndex] = { ...this.groups[needlyGroupIndex], ...group };
    }

    this.notificationService.success('Группа успешно обновлена')
  }

  onError(error: unknown): void {
    console.error(error);
  }

}
