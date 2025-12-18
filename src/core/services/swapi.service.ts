import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Film, FilmsResponse } from '../models/film.model';
import { Character } from '../models/character.model';
import { Starship } from '../models/starship.model';
import { Vehicle } from '../models/vehicle.model';
import { Species } from '../models/species.model';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private readonly baseUrl = 'https://swapi.info/api';

  constructor(private http: HttpClient) {}

  getAllFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.baseUrl}/films`).pipe(
      catchError(this.handleError)
    );
  }

  getCharacters(urls: string[]): Observable<Character[]> {
    if (!urls || urls.length === 0) {
      return of([]);
    }

    const requests = urls.map(url => 
      this.http.get<Character>(url).pipe(
        catchError(() => of(null))
      )
    );

    return forkJoin(requests).pipe(
      map(characters => characters.filter((char): char is Character => char !== null))
    );
  }

  getStarships(urls: string[]): Observable<Starship[]> {
    if (!urls || urls.length === 0) {
      return of([]);
    }

    const requests = urls.map(url => 
      this.http.get<Starship>(url).pipe(
        catchError(() => of(null))
      )
    );

    return forkJoin(requests).pipe(
      map(starships => starships.filter((ship): ship is Starship => ship !== null))
    );
  }

  getVehicles(urls: string[]): Observable<Vehicle[]> {
    if (!urls || urls.length === 0) {
      return of([]);
    }

    const requests = urls.map(url => 
      this.http.get<Vehicle>(url).pipe(
        catchError(() => of(null))
      )
    );

    return forkJoin(requests).pipe(
      map(vehicles => vehicles.filter((vehicle): vehicle is Vehicle => vehicle !== null))
    );
  }

  getSpecies(urls: string[]): Observable<Species[]> {
    if (!urls || urls.length === 0) {
      return of([]);
    }

    const requests = urls.map(url => 
      this.http.get<Species>(url).pipe(
        catchError(() => of(null))
      )
    );

    return forkJoin(requests).pipe(
      map(species => species.filter((spec): spec is Species => spec !== null))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
