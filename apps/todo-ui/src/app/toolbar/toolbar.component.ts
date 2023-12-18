import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import LoginComponent from '#app/auth/login/login.component';
import { meta as appInfo } from '#configs/meta';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export default class ToolbarComponent {
  loginStatus?: 'loggedIn' | 'loggedOut';
  user?: { name?: string; id?: string };
  platform = inject(PLATFORM_ID);
  url: string;
  meta = appInfo;

  constructor(
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
  ) {
    this.router.events.subscribe({
      next: (val) => {
        this.url = this.location.path();
      },
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platform)) {
      this.loginStatus = localStorage.getItem('auth_token')
        ? 'loggedIn'
        : 'loggedOut';

      this.user = {
        name: localStorage.getItem('userFirstName')!,
        id: localStorage.getItem('userId')!,
      };
    }
  }

  login() {
    this.dialog.open(LoginComponent);
  }

  logout() {
    if (isPlatformBrowser(this.platform)) {
      localStorage.clear();
      location.reload();
    }
  }
}
