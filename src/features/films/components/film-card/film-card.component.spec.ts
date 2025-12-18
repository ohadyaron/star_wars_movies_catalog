import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmCardComponent } from './film-card.component';
import { Film } from '../../../../core/models/film.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FilmCardComponent', () => {
  let component: FilmCardComponent;
  let fixture: ComponentFixture<FilmCardComponent>;

  const mockFilm: Film = {
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl: 'It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.',
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1977-05-25',
    species: [],
    starships: [],
    vehicles: [],
    characters: [],
    planets: [],
    url: 'https://swapi.info/api/films/1',
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmCardComponent, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FilmCardComponent);
    component = fixture.componentInstance;
    component.film = mockFilm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display film title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('mat-card-title');
    expect(title?.textContent).toContain('A New Hope');
  });

  it('should display episode number', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitle = compiled.querySelector('mat-card-subtitle');
    expect(subtitle?.textContent).toContain('Episode 4');
  });

  it('should display release date', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1977-05-25');
  });

  it('should display director', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('George Lucas');
  });

  it('should display producer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Gary Kurtz, Rick McCallum');
  });

  it('should initially show collapsed crawl text', () => {
    expect(component.crawlExpanded).toBe(false);
  });

  it('should toggle crawl expansion on button click', () => {
    component.film = {
      ...mockFilm,
      opening_crawl: 'A'.repeat(200)
    };
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(component.crawlExpanded).toBe(false);

    button?.click();
    fixture.detectChanges();
    expect(component.crawlExpanded).toBe(true);

    button?.click();
    fixture.detectChanges();
    expect(component.crawlExpanded).toBe(false);
  });

  it('should truncate long opening crawl text', () => {
    const longText = 'A'.repeat(200);
    component.film = { ...mockFilm, opening_crawl: longText };
    
    const truncated = component.truncatedCrawl;
    expect(truncated.length).toBeLessThan(longText.length);
    expect(truncated).toContain('...');
  });

  it('should not truncate short opening crawl text', () => {
    const shortText = 'Short text';
    component.film = { ...mockFilm, opening_crawl: shortText };
    
    const result = component.truncatedCrawl;
    expect(result).toBe(shortText);
  });
});
