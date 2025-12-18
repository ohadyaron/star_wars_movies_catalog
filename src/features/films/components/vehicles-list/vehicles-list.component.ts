import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { SwapiService } from '../../../../core/services/swapi.service';
import { LoadingState } from '../../../../core/models/loading-state.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesListComponent implements OnDestroy {
  @Input({ required: true }) vehicleUrls: string[] = [];

  vehicles$ = new BehaviorSubject<Vehicle[]>([]);
  loadingState$ = new BehaviorSubject<LoadingState>({ isLoading: false, error: null });
  
  private hasLoaded = false;
  private destroy$ = new Subject<void>();

  constructor(private swapiService: SwapiService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.vehicles$.complete();
    this.loadingState$.complete();
  }

  onPanelOpened(): void {
    if (!this.hasLoaded && this.vehicleUrls.length > 0) {
      this.loadVehicles();
    }
  }

  trackByVehicleUrl(index: number, vehicle: Vehicle): string {
    return vehicle.url;
  }

  private loadVehicles(): void {
    this.hasLoaded = true;
    this.loadingState$.next({ isLoading: true, error: null });

    this.swapiService.getVehicles(this.vehicleUrls)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vehicles) => {
          this.vehicles$.next(vehicles);
          this.loadingState$.next({ isLoading: false, error: null });
        },
        error: (error) => {
          this.loadingState$.next({ 
            isLoading: false, 
            error: error.message || 'Failed to load vehicles' 
          });
        }
      });
  }
}
