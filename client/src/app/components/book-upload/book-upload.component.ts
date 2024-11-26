import { Component } from '@angular/core';
import { BookService } from '../../services/book.service';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-book-upload',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './book-upload.component.html',
  styleUrl: './book-upload.component.scss'
})
export class BookUploadComponent {
  file: File | null = null;
  bookData = {
    title: '',
    author: '',
    description: '',
    coverImage: '',
    categories: '',
  };

  constructor(private bookService: BookService) {}

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  uploadBook(): void {
    if (!this.file) {
      alert('Выберите файл книги!');
      return;
    }

    this.bookService.uploadBookFile(this.file).subscribe((response) => {
      const fileUrl = response.fileUrl;

      const bookPayload = {
        ...this.bookData,
        fileUrl,
        fileType: this.file?.name.split('.').pop() || 'txt',
        categories: this.bookData.categories.split(',').map((cat) => cat.trim())
      };

      this.bookService.createBook(bookPayload).subscribe(() => {
        alert('Книга успешно загружена!');
      });
    });
  }
}
