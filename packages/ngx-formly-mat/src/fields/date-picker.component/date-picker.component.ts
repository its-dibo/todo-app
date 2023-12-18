import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

// todo: custom date format, icon, custom validation
// todo: replace props.minValue to props.min, change props.min type from number to Date|number
@Component({
  selector: 'formly-date',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    // adaptor for MatDatepickerModule (or MatMomentDateModule)
    MatNativeDateModule,
    FormlyModule,
    FormlyMaterialModule,
    MatInputModule,
  ],
  template: `
    <mat-form-field appearance="fill" class="date">
      <mat-label>{{ props.label || field.key || 'Select a date' }}</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [min]="props.minValue"
        [max]="props.maxValue"
        (dateChange)="onChange($event)"
      />
      <mat-hint>{{ props.description || 'DD/MM/YYYY' }}</mat-hint>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
})
export class FormlyDatePickerMatComponentMat extends FieldType<FieldTypeConfig> {
  ngOnInit(): void {
    let today = Date.now();
    if (!Number.isNaN(this.props.minValue)) {
      // number of days +/- today
      // for a previous day, use a negative value
      this.props.minValue = new Date(
        today + this.props.minValue * 24 * 60 * 60 * 1000,
      );
    }

    if (!Number.isNaN(this.props.maxValue)) {
      this.props.maxValue = new Date(
        today + this.props.maxValue * 24 * 60 * 60 * 1000,
      );
    }
  }

  onChange($event: any) {
    if (this.props.onChange) {
      this.props.onChange($event, this.model);
    }
  }
}
