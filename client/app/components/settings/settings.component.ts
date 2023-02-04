import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';

import { Settings } from '@app/core/models';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from '@app/core/services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  form: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    patronymicName: new FormControl(''),
  });

  constructor(
    private settingsService: SettingsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.onGetSettings();
  }

  onGetSettings(): void {
    this.settingsService.getUserSettings().subscribe({
      next: (settings) => this.onSettingsLoaded(settings),
      error: (error) => this.onError(error),
    });
  }

  onSettingsLoaded(settings: Settings): void {
    this.form.reset({
      firstName: settings.firstName,
      lastName: settings.lastName,
      patronymicName: settings.patronymicName,
    });
  }

  onClickSaveSettings(): void {
    const settings = this.form.value;

    this.settingsService.updateUserSettings(settings).subscribe({
      next: () => this.onSavedSettings(),
    });
  }

  onSavedSettings(): void {
    this.notificationService.success('Настройки успешно сохранены');
  }

  onError(error: unknown): void {
    console.error(error);
  }
}
