import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Starship } from '../../../../core/models/starship.model';
import { SwapiService } from '../../../../core/services/swapi.service';
import { LoadingState } from '../../../../core/models/loading-state.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-starships-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './starships-list.component.html',
  styleUrls: ['./starships-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarshipsListComponent implements OnDestroy {
  @Input({ required: true }) starshipUrls: string[] = [];

  starships$ = new BehaviorSubject<Starship[]>([]);
  loadingState$ = new BehaviorSubject<LoadingState>({ isLoading: false, error: null });
  
  private hasLoaded = false;
  private destroy$ = new Subject<void>();

  constructor(private swapiService: SwapiService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.starships$.complete();
    this.loadingState$.complete();
  }

  onPanelOpened(): void {
    if (!this.hasLoaded && this.starshipUrls.length > 0) {
      this.loadStarships();
    }
  }

  trackByStarshipUrl(index: number, starship: Starship): string {
    return starship.url;
  }

  private loadStarships(): void {
    this.hasLoaded = true;
    this.loadingState$.next({ isLoading: true, error: null });

    this.swapiService.getStarships(this.starshipUrls)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (starships) => {
          this.starships$.next(starships);
          this.loadingState$.next({ isLoading: false, error: null });
        },
        error: (error) => {
          this.loadingState$.next({ 
            isLoading: false, 
            error: error.message || 'Failed to load starships' 
          });
        }
      });
  }
}
