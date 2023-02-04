import { Component, Input } from '@angular/core';

import { User } from '@app/core/models';

@Component({
  selector: 'app-users-settings',
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss']
})
export class UsersSettingsComponent {

  @Input() users: User[] = [];

}
