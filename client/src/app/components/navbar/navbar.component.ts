import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonToggleModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isAuthenticated: boolean = false;
  readMode: 'light' | 'dark' = 'light'
  
  constructor(private authService: AuthService, private router: Router){
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated:boolean) => {
      this.isAuthenticated = isAuthenticated
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMode(){
    this.readMode = this.readMode === 'light'? 'dark' : 'light';
    document.documentElement.setAttribute('theme', this.readMode);
  }
}
