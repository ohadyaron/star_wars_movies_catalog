import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilmsPageComponent } from '../features/films/pages/films-page/films-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FilmsPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Star Wars Films Catalog';
}
