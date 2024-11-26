import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Book } from '../models/Book';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl

  private books: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);
  public books$ = this.books.asObservable();

  constructor(private http: HttpClient) {}

  getBooks(){
    return this.http.get<Book[]>(`${this.apiUrl}/api/books`)
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/api/books/${id}`);
  }

  createBook(bookData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/books`, bookData);
  }

  // Загрузка  книги
  uploadBookFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/api/books/upload`, formData);
  }

  getBookText(fileUrl: string): Observable<string> {
    return this.http.get(fileUrl, { responseType: 'text' });
  }

}
