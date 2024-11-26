import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Bookmark } from '../models/Bookmark';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private apiUrl = environment.apiUrl

  private bookmarks: BehaviorSubject<Bookmark[]> = new BehaviorSubject<Bookmark[]>([]);
  public bookmarks$ = this.bookmarks.asObservable();

  constructor(private http: HttpClient) { }

  getBookmarks(userId: number){
    return this.http.get<Bookmark[]>(`${this.apiUrl}/api/bookmarks/${userId}`)
  }

  getBookmarkById(id: number){
    return this.http.get(`${this.apiUrl}/api/bookmarks/${id}`);
  }

  addBookmark(bookmark: Partial<Bookmark>): Observable<Bookmark> {
    return this.http.post<Bookmark>(`${this.apiUrl}/api/bookmarks`, bookmark);
  }

  updateBookmark(id: number, bookmark: Partial<Bookmark>): Observable<Bookmark> {
    return this.http.patch<Bookmark>(`${this.apiUrl}/api/bookmarks/${id}`, bookmark);
  }

  deleteBookmark(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/bookmarks/${id}`);
  }

}
