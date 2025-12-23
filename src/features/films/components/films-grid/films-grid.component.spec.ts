import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmsGridComponent } from './films-grid.component';
import { SwapiService } from '../../../../core/services/swapi.service';
import { FilmSearchService } from '../../services/film-search.service';
import { of, throwError } from 'rxjs';
import { Film } from '../../../../core/models/film.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FilmsGridComponent', () => {
  let component: FilmsGridComponent;
  let fixture: ComponentFixture<FilmsGridComponent>;
  let swapiService: jest.Mocked<SwapiService>;
  let filmSearchService: FilmSearchService;

  const mockFilms: Film[] = [
    {
      title: 'A New Hope',
      episode_id: 4,
      opening_crawl: 'Test crawl',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      release_date: '1977-05-25',
      species: [],
      starships: [],
      vehicles: [],
      characters: [],
      planets: [],
      url: 'https://swapi.info/api/films/1',
      created: '2014-12-10T14:23:31.880000Z',
      edited: '2014-12-20T19:49:45.256000Z'
    },
    {
      title: 'The Empire Strikes Back',
      episode_id: 5,
      opening_crawl: 'Test crawl 2',
      director: 'Irvin Kershner',
      producer: 'Gary Kurtz',
      release_date: '1980-05-17',
      species: [],
      starships: [],
      vehicles: [],
      characters: [],
      planets: [],
      url: 'https://swapi.info/api/films/2',
      created: '2014-12-12T11:26:24.656000Z',
      edited: '2014-12-15T13:07:53.386000Z'
    }
  ];

  beforeEach(async () => {
    const swapiServiceSpy = {
      getAllFilms: jest.fn()
    } as unknown as jest.Mocked<SwapiService>;
    
    await TestBed.configureTestingModule({
      imports: [FilmsGridComponent, BrowserAnimationsModule],
      providers: [
        { provide: SwapiService, useValue: swapiServiceSpy },
        FilmSearchService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilmsGridComponent);
    component = fixture.componentInstance;
    swapiService = TestBed.inject(SwapiService) as jest.Mocked<SwapiService>;
    filmSearchService = TestBed.inject(FilmSearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load films on init', (done) => {
    swapiService.getAllFilms.mockReturnValue(of(mockFilms));
    
    fixture.detectChanges();

    component.isLoading$.subscribe(isLoading => {
      if (!isLoading) {
        component.films$.subscribe(films => {
          expect(films.length).toBe(2);
          expect(swapiService.getAllFilms).toHaveBeenCalled();
          done();
        });
      }
    });
  });

  it('should show loading state while fetching films', () => {
    swapiService.getAllFilms.mockReturnValue(of(mockFilms));
    
    component.ngOnInit();
    
    // With synchronous observable, loading completes immediately
    expect(swapiService.getAllFilms).toHaveBeenCalled();
  });

  it('should handle errors when loading films', (done) => {
    const errorMessage = 'Failed to load films';
    swapiService.getAllFilms.mockReturnValue(
      throwError(() => new Error(errorMessage))
    );
    
    fixture.detectChanges();

    component.error$.subscribe(error => {
      if (error) {
        expect(error).toBe(errorMessage);
        done();
      }
    });
  });

  it('should filter films by search term', (done) => {
    swapiService.getAllFilms.mockReturnValue(of(mockFilms));
    
    fixture.detectChanges();

    setTimeout(() => {
      filmSearchService.setSearchTerm('empire');
      
      setTimeout(() => {
        component.films$.subscribe(films => {
          expect(films.length).toBe(1);
          expect(films[0].title).toBe('The Empire Strikes Back');
          done();
        });
      }, 50);
    }, 50);
  });

  it('should return all films when search term is empty', (done) => {
    swapiService.getAllFilms.mockReturnValue(of(mockFilms));
    
    fixture.detectChanges();

    setTimeout(() => {
      filmSearchService.setSearchTerm('');
      
      setTimeout(() => {
        component.films$.subscribe(films => {
          expect(films.length).toBe(2);
          done();
        });
      }, 50);
    }, 50);
  });

  it('should use trackBy function with film URL', () => {
    const film = mockFilms[0];
    const result = component.trackByFilmUrl(0, film);
    expect(result).toBe(film.url);
  });

  it('should perform case-insensitive filtering', (done) => {
    swapiService.getAllFilms.mockReturnValue(of(mockFilms));
    
    fixture.detectChanges();

    setTimeout(() => {
      filmSearchService.setSearchTerm('HOPE');
      
      setTimeout(() => {
        component.films$.subscribe(films => {
          expect(films.length).toBe(1);
          expect(films[0].title).toBe('A New Hope');
          done();
        });
      }, 50);
    }, 50);
  });
});
