import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/Book';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { BookmarkService } from '../../services/bookmark.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterModule, NgIf,MatIconModule, MatButtonModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
  book!: Book;

  constructor(private bookService: BookService, 
              private route: ActivatedRoute, 
              private authService: AuthService,
              private bookmarkService: BookmarkService,
              private snackBar: MatSnackBar){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id){
      this.bookService.getBookById(id).subscribe(book => {
        this.book = book;
      })
    }
  }

  addBookmark() {
    const currentPage = 1;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        // const userId = user.id;
        const bookmark = {
          userId: user.id,
          bookId: this.book.id,
          page: currentPage,
        };
    
        this.bookmarkService.addBookmark(bookmark).subscribe({
          next: () => {
            this.snackBar.open('Закладка добавлена!', 'Закрыть', {
              duration: 3000,
            });
          },
          error: (err) => console.error('Ошибка при добавлении закладки', err),
        });
      }, 
      error: (err) => console.error('Ошибка при получении текущего пользователя', err)
    });
  }
}
