import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/Bookmark';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatButtonModule],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent implements OnInit {
  displayedColumns: string[] = ['bookId', 'page', 'actions'];
  bookmarks = new MatTableDataSource<Bookmark>();

  userId: number | null = null;

  constructor(
    private bookmarkService: BookmarkService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.userId = user.id
      this.loadBookmarks();
    });
    
  }

  loadBookmarks() {
    if (this.userId){
      this.bookmarkService.getBookmarks(this.userId).subscribe({
        next: (data) => (this.bookmarks.data = data),
        error: (err) => console.error('Error on load Bookmark', err),
      });
    }
  }

  deleteBookmark(bookmarkId: number) {
    this.bookmarkService.deleteBookmark(bookmarkId).subscribe({
      next: () => {
        this.snackBar.open('Закладка удалена!', 'Закрыть', { duration: 3000 });
        this.loadBookmarks();
      },
      error: (err) => console.error('Ошибка удаления закладки', err),
    });
  }

  goToBookmark(bookmark: Bookmark) {
    this.router.navigate(['/books', bookmark.bookId, 'read']);
  }
}
