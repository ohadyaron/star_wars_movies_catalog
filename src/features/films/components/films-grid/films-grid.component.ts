import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Film } from '../../../../core/models/film.model';
import { SwapiService } from '../../../../core/services/swapi.service';
import { FilmSearchService } from '../../services/film-search.service';
import { FilmCardComponent } from '../film-card/film-card.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-films-grid',
  standalone: true,
  imports: [
    CommonModule,
    FilmCardComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './films-grid.component.html',
  styleUrls: ['./films-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmsGridComponent implements OnInit, OnDestroy {
  films$!: Observable<Film[]>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  
  private allFilms: Film[] = [];
  private destroy$ = new Subject<void>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private swapiService: SwapiService,
    private filmSearchService: FilmSearchService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.loadingSubject.asObservable();
    this.error$ = this.errorSubject.asObservable();

    this.loadFilms();
    this.setupFiltering();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loadingSubject.complete();
    this.errorSubject.complete();
  }

  trackByFilmUrl(index: number, film: Film): string {
    return film.url;
  }

  private loadFilms(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.swapiService.getAllFilms()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (films) => {
          this.allFilms = films;
          this.loadingSubject.next(false);
        },
        error: (error) => {
          this.errorSubject.next(error.message || 'Failed to load films');
          this.loadingSubject.next(false);
        }
      });
  }

  private setupFiltering(): void {
    this.films$ = combineLatest([
      this.filmSearchService.searchTerm$,
      this.loadingSubject.asObservable()
    ]).pipe(
      map(([searchTerm]) => this.filterFilms(searchTerm)),
      takeUntil(this.destroy$)
    );
  }

  private filterFilms(searchTerm: string): Film[] {
    if (!searchTerm) {
      return this.allFilms;
    }

    return this.allFilms.filter(film =>
      film.title.toLowerCase().includes(searchTerm)
    );
  }
}
