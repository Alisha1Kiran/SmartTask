import { Component, inject, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { ResponsiveService } from '../../services/responsive/responsive.service';
import { UserProfile } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isMobile = inject(ResponsiveService).isMobile;
  private auth: Auth = inject(Auth);
  private authService = inject(AuthService)
  userName: string | null = '';
  userProfile = signal<UserProfile | null>(null);

  ngOnInit() {
    this.authService.userProfile$.subscribe(profile => {
      this.userProfile.set(profile);
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      console.log('User signed out');
      // Optional: navigate to login page
    });
  }
}
