import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { FilmsGridComponent } from '../../components/films-grid/films-grid.component';

@Component({
  selector: 'app-films-page',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    FilmsGridComponent
  ],
  templateUrl: './films-page.component.html',
  styleUrls: ['./films-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmsPageComponent {}
