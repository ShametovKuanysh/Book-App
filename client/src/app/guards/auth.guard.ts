import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = !!localStorage.getItem('token');
  console.log(`isAuthenticated: ${isAuthenticated}`)
  if (!isAuthenticated) {
    inject(Router).navigate(['/login']);
  }
  return isAuthenticated;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (!isAuthenticated) {
    inject(Router).navigate(['/login']);
  }
  return isAuthenticated;
};
