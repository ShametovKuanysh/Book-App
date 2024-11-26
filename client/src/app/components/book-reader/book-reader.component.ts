import { Component, EventEmitter, Output } from '@angular/core';
import { Book } from '../../models/Book';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { NgIf } from '@angular/common';
import mammoth from 'mammoth';
import { HttpClient } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {  FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BookmarkService } from '../../services/bookmark.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-reader',
  standalone: true,
  imports: [NgIf, MatButtonModule, FormsModule, MatIconModule],
  templateUrl: './book-reader.component.html',
  styleUrl: './book-reader.component.scss'
})
export class BookReaderComponent {
  @Output() toggleMode: EventEmitter<string> = new EventEmitter();
  
  book!: Book;
  bookText: string = '';
  private pageSize = 1000;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: string[] = [];



  constructor(private route: ActivatedRoute, 
              private bookService: BookService, 
              private http: HttpClient,
              private authService: AuthService,
              private bookmarkService: BookmarkService) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.params['id'];
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe((data) => {
        this.book = data;
        this.readBook();
      });
    }
  }

  readBook() {
    if (this.book && this.book.fileUrl) {
      const fileExtension = this.book.fileUrl.split('.').pop();
      switch (this.book.fileType){
        case 'txt': 
          this.loadTxtFile();
          break;
        case 'docx':
          this.loadDocxFile();
          break;
        case 'pdf':
          // this.loadPdfFile();
          break;
        default:
          console.error('Can`t open this type.');
      }
    } else {
      console.error('URL undefined');
    }
  }
  
  loadTxtFile() {
    this.http.get(this.book.fileUrl, { responseType: 'text' }).subscribe(
      (content) => {
        this.pages = this.paginateText(content);
        this.totalPages = this.pages.length;
        this.loadPage(1);
      },
      (error) => {
        console.error('Error on load txt file', error);
      }
    );
  }
  
  loadDocxFile() {
    this.http.get(this.book.fileUrl, { responseType: 'arraybuffer' }).subscribe(
      (buffer) => {
        mammoth
          .extractRawText({ arrayBuffer: buffer })
          .then((result) => {
            this.pages = this.paginateText(result.value);
            this.totalPages = this.pages.length;
            this.loadPage(1);
          })
          .catch((error) => {
            console.error('Error on load docx file', error);
          });
      },
      (error) => {
        console.error('Error on load docx file', error);
      }
    );
  }

  paginateText(text: string): string[] {
    const pages = [];
    for (let i = 0; i < text.length; i += this.pageSize) {
      pages.push(text.slice(i, i + this.pageSize));
    }
    return pages;
  }

  loadPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.bookText = this.pages[page - 1];
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  addBookmark() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        // const userId = user.id;
        const bookmark = {
          userId: user.id,
          bookId: this.book.id,
          page: this.currentPage,
        };
    
        this.bookmarkService.addBookmark(bookmark).subscribe({
          next: () => {
          },
          error: (err) => console.error('Ошибка при добавлении закладки', err),
        });
      }, 
      error: (err) => console.error('Ошибка при получении текущего пользователя', err)
    });
  }
}
