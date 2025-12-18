import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Species } from '../../../../core/models/species.model';
import { SwapiService } from '../../../../core/services/swapi.service';
import { LoadingState } from '../../../../core/models/loading-state.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-species-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './species-list.component.html',
  styleUrls: ['./species-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeciesListComponent implements OnDestroy {
  @Input({ required: true }) speciesUrls: string[] = [];

  species$ = new BehaviorSubject<Species[]>([]);
  loadingState$ = new BehaviorSubject<LoadingState>({ isLoading: false, error: null });
  
  private hasLoaded = false;
  private destroy$ = new Subject<void>();

  constructor(private swapiService: SwapiService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.species$.complete();
    this.loadingState$.complete();
  }

  onPanelOpened(): void {
    if (!this.hasLoaded && this.speciesUrls.length > 0) {
      this.loadSpecies();
    }
  }

  trackBySpeciesUrl(index: number, species: Species): string {
    return species.url;
  }

  private loadSpecies(): void {
    this.hasLoaded = true;
    this.loadingState$.next({ isLoading: true, error: null });

    this.swapiService.getSpecies(this.speciesUrls)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (species) => {
          this.species$.next(species);
          this.loadingState$.next({ isLoading: false, error: null });
        },
        error: (error) => {
          this.loadingState$.next({ 
            isLoading: false, 
            error: error.message || 'Failed to load species' 
          });
        }
      });
  }
}
