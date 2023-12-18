import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { toObservable } from '@engineers/rxjs';

/**
 * an input that  supports autocomplete
 * see ./chips-mat.ts
 */
@Component({
  selector: 'formly-chips',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormlyModule,
    FormlyMaterialModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    AsyncPipe,
  ],
  template: `
    <mat-form-field appearance="fill" style="display:block;">
      <mat-label>{{ props.label || field.key }}</mat-label>

      <input
        #input
        [formControl]="formControl"
        [formlyAttributes]="field"
        matInput
        [matAutocomplete]="auto"
      />
      <mat-hint
        *ngIf="props.description"
        [innerHTML]="props.description"
      ></mat-hint>
    </mat-form-field>

    <mat-autocomplete #auto="matAutocomplete">
      @for (item of autoCompleteList; track item) {
        <mat-option [value]="item">{{ item }}</mat-option>
      }
    </mat-autocomplete>
  `,
})
export class FormlyInputAutoCompleteMatComponent extends FieldType<FieldTypeConfig> {
  autoCompleteList: string[];

  ngOnInit(): void {
    // when the input changed, trigger  autoComplete() to update `autoCompleteList`
    this.formControl.valueChanges.subscribe({
      next: (value) => {
        toObservable(
          this.props.autoComplete?.(value, this.autoCompleteList),
        ).subscribe({
          next: (items: string[]) => {
            this.autoCompleteList = items;
          },
        });
      },
    });
  }
}
