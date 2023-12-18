import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { QuillEditorComponent } from 'ngx-quill';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'formly-quill',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    QuillEditorComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  // todo: add other props and events
  template: `
    <mat-label>{{ props.label }}</mat-label>
    <quill-editor
      [formControl]="formControl"
      [formlyAttributes]="field"
      [modules]="props.modules"
      [customModules]="props.customModules || []"
      [styles]="props.styles"
      [placeholder]="props.placeholder"
      [bounds]="props.bounds"
      [classes]="props.classes"
      [compareValues]="props.compareValues"
      [customModules]="props.customModules"
      [customOptions]="props.customOptions || []"
      [customToolbarPosition]="props.customToolbarPosition"
      [debounceTime]="props.debounceTime"
      [debug]="props.debug"
      [defaultEmptyValue]="props.defaultEmptyValue"
      [filterNull]="props.filterNull"
      [format]="props.format"
      [formats]="props.formats"
      [strict]="props.strict"
      [trimOnValidation]="props.trimOnValidation"
      [linkPlaceholder]="props.linkPlaceholder"
    ></quill-editor>
    <mat-hint
      *ngIf="props.description"
      [innerHTML]="props.description"
    ></mat-hint>
  `,
  styleUrls: ['./quill.component.scss'],
})
export class FormlyQuillMatComponent extends FieldType<FieldTypeConfig> {}
