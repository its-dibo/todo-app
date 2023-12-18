import { Component, ElementRef, ViewChild } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatInputModule } from '@angular/material/input';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@engineers/rxjs';

/**
 * an input that accepts chips and supports autocomplete
 * each item can be removed or edited
 *
 * props:
 *   - items {string[]} a list of pre entered chip items 
 *   - autoComplete {(value: string, items: string[], autoCompleteList:string[])=> string[]}
 *       a function that receives the current input's value, the current data items, and the current autoComplete list 
 *       then returns a new list of suggested items
 *   - placeholder {string} a placeholder that displayed in the input field 

 */
@Component({
  selector: 'formly-chips',
  standalone: true,
  imports: [
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

      <mat-chip-grid #chipGrid>
        @for (item of items; track item) {
          <mat-chip-row
            (removed)="remove(item)"
            [editable]="true"
            (edited)="edit(item, $event)"
            [aria-description]="'press enter to edit ' + item"
          >
            {{ item }}
            <button matChipRemove [attr.aria-label]="'remove ' + item">
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        }
      </mat-chip-grid>

      <input
        #input
        [formControl]="formControl"
        [formlyAttributes]="field"
        [placeholder]="props.placeholder || 'add...'"
        [matChipInputFor]="chipGrid"
        [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
        [matChipInputAddOnBlur]="addOnBlur"
        (matChipInputTokenEnd)="add($event)"
        [matAutocomplete]="auto"
      />

      <mat-autocomplete
        #auto="matAutocomplete"
        (optionSelected)="selected($event)"
      >
        @for (item of autoCompleteList; track item) {
          <mat-option [value]="item">{{ item }}</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class FormlyChipsMatComponent extends FieldType<FieldTypeConfig> {
  // chips items
  // to set initial items, use `field.defaultValue: []`
  items: string[];
  // suggested items
  autoCompleteList: string[];
  // todo: issue: when selecting an option from autoCompleteList,
  // the search term is added too when `addOnBlur` is true
  // https://github.com/angular/components/issues/13574#issuecomment-1247988216
  // https://github.com/angular/components/issues/19279#issuecomment-627263513
  addOnBlur = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.items = this.formControl.value || [];
    if (typeof this.items === 'string') this.items = [this.items];
    // when the input changed, trigger  autoComplete() to update `autoCompleteList`
    this.formControl.valueChanges.subscribe({
      next: (value) => {
        toObservable(
          this.props.autoComplete?.(value, this.items, this.autoCompleteList),
        ).subscribe({
          next: (items: string[]) => {
            this.autoCompleteList = items
              // remove the items that are already added
              .filter((el) => !this.items?.includes(el));
          },
        });
      },
    });
  }

  onChange($event: any) {
    if (this.props.onChange) {
      this.props.onChange($event, this.model);
    }
  }

  remove(item: string) {
    this.items = this.items.filter((el: string) => el !== item);
    this.formControl.setValue(this.items);
  }

  edit(item: string, ev: MatChipEditedEvent) {
    let newValue = ev.value?.trim();
    if (!newValue) return this.remove(item);

    this.items = this.items.map((el: string) => (el === item ? newValue : el));
    this.formControl.setValue(this.items);
  }

  add(ev: MatChipInputEvent) {
    let value = ev.value?.trim();
    if (value && !this.items.includes(value)) this.items.push(value);

    // clear thee input
    ev.chipInput.clear();
    this.formControl.setValue(this.items);
  }

  selected(ev: MatAutocompleteSelectedEvent) {
    let value = ev.option.value?.trim();

    if (value && !this.items.includes(value)) this.items.push(value);
    this.formControl.setValue(this.items);

    // clear the input's value
    this.input.nativeElement.value = '';
  }
}
