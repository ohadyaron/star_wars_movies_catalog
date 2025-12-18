import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Character } from '../../../../core/models/character.model';
import { SwapiService } from '../../../../core/services/swapi.service';
import { LoadingState } from '../../../../core/models/loading-state.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersListComponent implements OnDestroy {
  @Input({ required: true }) characterUrls: string[] = [];

  characters$ = new BehaviorSubject<Character[]>([]);
  loadingState$ = new BehaviorSubject<LoadingState>({ isLoading: false, error: null });
  
  private hasLoaded = false;
  private destroy$ = new Subject<void>();

  constructor(private swapiService: SwapiService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.characters$.complete();
    this.loadingState$.complete();
  }

  onPanelOpened(): void {
    if (!this.hasLoaded && this.characterUrls.length > 0) {
      this.loadCharacters();
    }
  }

  trackByCharacterUrl(index: number, character: Character): string {
    return character.url;
  }

  private loadCharacters(): void {
    this.hasLoaded = true;
    this.loadingState$.next({ isLoading: true, error: null });

    this.swapiService.getCharacters(this.characterUrls)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (characters) => {
          this.characters$.next(characters);
          this.loadingState$.next({ isLoading: false, error: null });
        },
        error: (error) => {
          this.loadingState$.next({ 
            isLoading: false, 
            error: error.message || 'Failed to load characters' 
          });
        }
      });
  }
}
