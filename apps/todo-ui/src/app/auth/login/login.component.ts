import {
  Component,
  Inject,
  PLATFORM_ID,
  inject,
  isDevMode,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Board, BoardComponent } from '#app/shared/board/board.component';
import { FormComponent } from '#app/shared/form/form.component';
import { FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import RegisterComponent from '../register/register.component';
import { MatButtonModule } from '@angular/material/button';

export interface User {
  auth_token: string;
  id: string;
  userFullName: string;
  firstName: string;
  lastName: string;
  role: string;
  // [key: string]: any;
}

export interface DialogData {
  title?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BoardComponent,
    FormComponent,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent {
  fields?: FormlyFieldConfig[];
  loading = true;
  message?: Board;
  platform = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    // todo: use `DynamicDialogComponent` from '@engineers/ngx-utils'
    // issue: DynamicDialogComponent doesn't receive events from this component,
    // i.e. after logging in successfully to dismiss the dialog
    public dialogRef: MatDialogRef<LoginComponent>,
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
          // todo: email or mobile
          key: 'email',
          type: 'email',
          props: {
            required: true,
          },
        },
        {
          key: 'password',
          props: {
            required: true,
            maxLength: 50,
            minLength: 8,
          },
        },
      ];
    }

    this.loading = false;
  }

  onSubmit(ev: { data: { [key: string]: any }; form: FormGroup }): void {
    this.loading = true;
    this.http
      // todo: interceptor to add the default apiVersion, if not provided
      .post<User>('api/auth/login', ev.data)
      .subscribe({
        next: (res) => {
          if (res.auth_token) {
            // todo: store user info in userService
            localStorage?.setItem('auth_token', res.auth_token);
            localStorage?.setItem('userId', res.id);
            localStorage?.setItem('userFirstName', res.firstName);
            localStorage?.setItem('userLastName', res.lastName);
            localStorage?.setItem('userRole', res.role);
            this.dialogRef.close('success');
            // location.reload();

            // if (this.redirect_url !== null)
            //   this.router
            //     .navigateByUrl(this.redirect_url!)
            //     // we need to reload the page after login
            //     .then(() => location.reload());
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
            // todo: interceptor to format error to {message, err_code, status_code}
            text: err.error?.message || err.message || err.error || err,
          };
          if (isDevMode()) console.error(err);
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  register() {
    this.dialogRef.close();
    this.dialog.open(RegisterComponent);
  }
}
