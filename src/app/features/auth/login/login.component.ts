import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  auth = inject(Auth);


  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  // Handle login form submission
  onSubmit() {
    if(this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      console.log("Values from submitted form", email, password)

      signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log("User logged in : ", userCredential.user);
      })
      .catch((error) => {
        console.log("Login Error : ", error.message);
      })
    } else {
      console.log(this.loginForm.markAllAsTouched)
    }
  }
}
