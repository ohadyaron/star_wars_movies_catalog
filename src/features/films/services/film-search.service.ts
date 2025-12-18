import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmSearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm$: Observable<string> = this.searchTermSubject.asObservable();

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term.toLowerCase().trim());
  }

  getCurrentSearchTerm(): string {
    return this.searchTermSubject.value;
  }
}
