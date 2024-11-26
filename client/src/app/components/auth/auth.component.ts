import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatButtonToggleModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isLoginMode: boolean = false;
  authForm!: FormGroup;
  error: string | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router){}

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if (!form.valid) return;

    const username = form.value.username
    const email = form.value.email
    const password = form.value.password

    this.error = null;

    if (this.isLoginMode) {
      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          this.error = err.error.message
        }
      })
    } else {
      this.authService.register(username, password, email).subscribe({
        next: (response) => {
          this.onSwitchMode()
        },
        error: (err) => {
          this.error = err.error.message
        }
      })
    }

    form.reset();
  }
}
