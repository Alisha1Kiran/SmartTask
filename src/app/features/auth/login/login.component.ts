import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  auth = inject(Auth);
  router = inject(Router);
  hidePassword = true;
  errorMessage: string | null = null;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  // Handle login form submission
  onSubmit() {
    this.errorMessage = null;
    if(this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      console.log("Values from submitted form", email, password)

      signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log("User logged in : ", userCredential.user);
        this.router.navigate(['/dashboard'])
      })
      .catch((error) => {
        console.log("Login Error : ", error.message);
        this.errorMessage = "Invalid email or password. Please try again.";
      })
    } else {
      console.log(this.loginForm.markAllAsTouched)
    }
  }
}
