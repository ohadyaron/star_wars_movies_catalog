import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { Film } from '../../../../core/models/film.model';
import { CharactersListComponent } from '../characters-list/characters-list.component';
import { StarshipsListComponent } from '../starships-list/starships-list.component';
import { VehiclesListComponent } from '../vehicles-list/vehicles-list.component';
import { SpeciesListComponent } from '../species-list/species-list.component';

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    CharactersListComponent,
    StarshipsListComponent,
    VehiclesListComponent,
    SpeciesListComponent
  ],
  templateUrl: './film-card.component.html',
  styleUrls: ['./film-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmCardComponent {
  @Input({ required: true }) film!: Film;
  
  crawlExpanded = false;

  toggleCrawl(): void {
    this.crawlExpanded = !this.crawlExpanded;
  }

  get truncatedCrawl(): string {
    const maxLength = 150;
    if (this.film.opening_crawl.length <= maxLength) {
      return this.film.opening_crawl;
    }
    return this.film.opening_crawl.substring(0, maxLength) + '...';
  }
}
