import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { ResponsiveService } from '../../services/responsive/responsive.service';

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
  userName: string | null = '';

  ngOnInit() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.userName = user.displayName || user.email;
      }
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      console.log('User signed out');
      // Optional: navigate to login page
    });
  }
}
