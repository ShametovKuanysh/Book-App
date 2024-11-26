import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user!: User
  showForm = false;
  editedUser!: User
  profileForm!: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.getCurrentUser();
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  logout() {
    this.authService.logout();
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (err) => console.error('Error getting user', err)
    });
  }
  
  editProfile(){
    this.profileForm.patchValue(this.user);
    this.showForm = true;
  }

  deleteProfile(){
    this.authService.deleteUser().subscribe({
      next: () => {
        this.authService.logout();
      },
      error: (err) => console.error('Error deleting user', err)
    });
  }

  onSubmit(){
    this.editedUser = this.profileForm.value;
    console.log(this.editedUser)
    this.authService.updateUser(this.editedUser).subscribe({
      next: () => {
        this.showForm = false;
        this.getCurrentUser()
      },
      error: (err) => console.error('Error updating user', err)
    });
  }
}
