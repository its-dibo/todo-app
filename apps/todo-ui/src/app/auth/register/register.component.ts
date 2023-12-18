import {
  Component,
  Inject,
  PLATFORM_ID,
  inject,
  isDevMode,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Board, BoardComponent } from '#app/shared/board/board.component';
import { HttpClient } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  fieldsMatchValidator,
  passwordPreset,
} from '@engineers/ngx-formly-mat';
import { FormComponent } from '../../shared/form/form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup } from '@angular/forms';
import LoginComponent from '../login/login.component';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  title?: string;
}

interface Response {
  auth_token: string;
  id: string;
  userFullName: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    CommonModule,
    BoardComponent,
    FormComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
})
export default class RegisterComponent {
  fields?: FormlyFieldConfig[];
  loading = true;
  message?: Board;
  platform = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<RegisterComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data?: DialogData,
  ) {}

  ngOnInit(): void {
    // if already logged in
    if (localStorage?.getItem('auth_token')) {
      this.message = {
        status: 'error',
        text: 'you are already loggedIn. <a href="/">Go to home page</a>',
      };
    } else {
      this.dialogRef.afterClosed().subscribe({
        next: (res) =>
          res === 'success' &&
          isPlatformBrowser(this.platform) &&
          location.reload(),
      });

      this.fields = [
        {
          key: 'firstName',
          props: {
            label: 'first name',
            required: true,
          },
        },
        {
          key: 'lastName',
          props: {
            label: 'last name',
            required: true,
          },
        },
        {
          key: 'email',
          type: 'email',
          props: {
            required: true,
          },
        },
        {
          key: 'mobile',
          props: {
            required: true,
          },
        },
        {
          fieldGroup: [
            {
              key: 'password',
              type: 'password',
              props: {
                label: 'password',
                required: true,
                minLength: 8,
              },
            },
            {
              key: 'passwordConfirm',
              type: 'password',
              props: {
                label: 'confirm password',
                description: 'repeat the password again',
              },
            },
          ],
          validators: {
            validation: [fieldsMatchValidator],
          },
        },
      ];
    }

    this.loading = false;
  }

  onSubmit(ev: { data: { [key: string]: any }; form: FormGroup }): void {
    this.loading = true;
    this.http
      .post<Response>('api/auth/register', ev.data)
      .subscribe({
        next: (res) => {
          if (res.auth_token) {
            localStorage?.setItem('auth_token', res.auth_token);
            localStorage?.setItem('userId', res.id);
            localStorage?.setItem('userFirstName', res.firstName);
            localStorage?.setItem('userLastName', res.lastName);
            this.dialogRef.close('success');
            // location.reload();
          } else {
            this.message = {
              status: 'error',
              text: 'cannot obtain an access token',
            };
          }
        },
        error: (err) => {
          this.message = {
            status: 'error',
            text: err.error?.message || err.message || err.error || err,
          };
          if (isDevMode()) console.error(err);
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  login() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent);
  }
}
