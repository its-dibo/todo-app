import { Injectable } from '@angular/core';
import { PlatformService } from '@engineers/ngx-utils';
import { User } from './auth/login/login.component';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  // todo: after login/register update this value without hard reloading
  currentUser?: Partial<User>;

  constructor(private platform: PlatformService) {
    if (this.platform.isBrowser())
      this.currentUser = {
        id: localStorage.getItem('userId')!,
        auth_token: localStorage.getItem('auth_token')!,
        userFullName: localStorage.getItem('userFullName')!,
        firstName: localStorage.getItem('firstName')!,
        lastName: localStorage.getItem('lastName')!,
        role: localStorage.getItem('userRole')!,
      };
  }
}
