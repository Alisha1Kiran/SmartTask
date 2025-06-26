import {
  Component,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatError,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  signupForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator }
  );

  ngOnInit() {
    this.signupForm.valueChanges.subscribe(() => {
      this.signupForm.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
      this.cdr.markForCheck();
    });
  }

  private passwordsMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  loading = false;
  error: string | null = null;

  async onSubmit() {
    this.error = null;
    if (this.signupForm.invalid) return;

    this.loading = true;

    const { email, password, name } = this.signupForm.value;

    try {
      // 1. Create user in Firebase Auth
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(this.auth, email!, password!);

      // 2. Create user doc in Firestore with default role
      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        role: 'member', // default role
      });

      // 3. Navigate to dashboard or login page
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = e.message || 'Signup failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
