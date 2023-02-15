import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-entity-settings',
  templateUrl: './entity-settings.component.html',
  styleUrls: ['./entity-settings.component.scss']
})
export class EntitySettingsComponent {

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  constructor(
    public dialogRef: MatDialogRef<EntitySettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
  ) {
    this.form.reset({
      name: this.data.name
    })
  }

  onClickSave(): void {
    this.dialogRef.close(this.form.value);
  }

}
