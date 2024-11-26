import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { authGuard, adminGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { BookReaderComponent } from './components/book-reader/book-reader.component';
import { BookUploadComponent } from './components/book-upload/book-upload.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';

export const routes: Routes = [
    { path: 'auth', component: AuthComponent },
    { path: 'books', component: BookListComponent, canActivate: [authGuard] },
    { path: 'books/:id', component: BookDetailsComponent, canActivate: [authGuard] },
    { path: 'books/:id/read', component: BookReaderComponent, canActivate: [authGuard] },
    { path: 'bookmarks', component: BookmarksComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'admin/upload', component: BookUploadComponent, canActivate: [authGuard, adminGuard] },
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth' },
];
