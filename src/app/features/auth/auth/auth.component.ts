import { Component, signal } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-auth',
  imports: [LoginComponent, SignupComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition('login => signup', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition('signup => login', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AuthComponent {
  showLogin = signal(true);

  toggleForm() {
    this.showLogin.set(!this.showLogin());
  }
}
