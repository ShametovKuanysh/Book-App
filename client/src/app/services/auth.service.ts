import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl
  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated$ = this.isAuthenticated.asObservable();

  login(username: string, password: string){
    return this.http.post(`${this.apiUrl}/api/auth/login`, { username, password}).pipe(
      tap((response: any) => {
        this.isAuthenticated.next(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('expires',response.expiresIn)
        // Set expiry timer for token
        const expiresIn = response.expiresIn;
        const now = Date.now();
        const expiryDate = new Date(now + expiresIn * 1000);
        setInterval(() => {
          if(expiryDate <= new Date()) {
            this.logout();
          }
        }, 600);
      })
    )
  }

  register(username: string, password: string, email: string){
    return this.http.post(`${this.apiUrl}/api/auth/register`, { username, password, email})
  }

  logout(){
    this.isAuthenticated.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.router.navigate(['/auth']);
  }

  isLogged(){
    if(!localStorage.getItem('token')){
      return false;
    }
    const expiresIn = localStorage.getItem('expires');
    if (expiresIn){
      const now = Date.now();
      const expiryDate = new Date(now + parseInt(expiresIn) * 1000);
      if(expiryDate <= new Date()) {
        this.logout();
        return false;
      }
    }
    return this.isAuthenticated.getValue();
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/auth/me`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/api/auth/`, user);
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/auth/`);
  }
}
