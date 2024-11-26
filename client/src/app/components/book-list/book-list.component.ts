import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';
import { Book } from '../../models/Book';
import { Observable } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit{
  books: Book[] = []
  search_text: string = ''

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(){
    this.loadBooks();
  }

  loadBooks(){
    this.bookService.getBooks().subscribe({
      next: (book: Book[]) => {
        if (this.search_text){
          this.books = book.filter(b => 
            b.title.toLowerCase().includes(this.search_text.toLowerCase()) || 
            b.author.toLowerCase().includes(this.search_text.toLowerCase()))
          return
        }

        this.books = book;
      },
      error: (error: any) => {
        console.log(error)
      }
    });
  }

  viewDetails(id: number){
    this.router.navigate(['/books', id])
  }
}
