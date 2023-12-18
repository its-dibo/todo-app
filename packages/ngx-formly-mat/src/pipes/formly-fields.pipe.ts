import { Pipe, PipeTransform } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Pipe({
  name: 'formlyFields',
  standalone: true,
})
export class FormlyFieldsPipe implements PipeTransform {
  /**
   * adjusts the formly fields array
   *
   * @param value
   * @param args
   * @param fields
   * @returns
   */
  transform(fields: FormlyFieldConfig[]): FormlyFieldConfig[] {
    return fields?.map((field) => {
      if (field.fieldGroup) {
        field.fieldGroup = this.transform(field.fieldGroup);
      } else {
        if (!field.props) {
          field.props = {};
        }
        if (!field.props.label) {
          // todo: convert to string
          field.props.label = field.key as string;
        }

        field.props.label =
          field.props.label.charAt(0).toUpperCase() +
            field.props.label.slice(1) || field.props.label;

        if (!field.type) {
          field.type = field.props.options
            ? 'select'
            : field.props.cols || field.props.cols
              ? 'textarea'
              : ['password', 'email'].includes(
                    (<string>field.key).toLowerCase(),
                  )
                ? <string>field.key
                : 'input';
        }

        if (
          typeof field.type === 'string' &&
          ['password', 'email'].includes(field.type.toLowerCase())
        ) {
          field.props.type = field.type;
          field.type = 'input';
        }

        if (field.props?.options && Array.isArray(field.props.options)) {
          field.props.options = field.props.options.map((el) => {
            return typeof el === 'string' ? { label: el, value: el } : el;
          });
        }

        // move props from top-level into props
        [
          'description',
          'label',
          'disabled',
          'placeholder',
          'options',
          'rows',
          'cols',
          'hidden',
          'max',
          'min',
          'maxLength',
          'minLength',
          'pattern',
          'required',
          'tabindex',
          'readonly',
          'attributes',
          'step',
          'focus',
          'blur',
          'keyup',
          'keydown',
          'keypress',
          'click',
          'change',
        ].forEach((prop) => {
          let value = field[prop as keyof FormlyFieldConfig];
          if (value && !field.props![prop]) {
            if (typeof value === 'function') {
              // use expressions to dynamically change a property
              field.expressions = {
                [`props.${prop}`]: field.props![prop],
                ...field.expressions,
              };
            } else {
              field.props![prop] = value;
            }

            delete field[prop as keyof FormlyFieldConfig];
          }
        });
      }

      return field;
    });
  }
}
