import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarshipsListComponent } from './starships-list.component';
import { SwapiService } from '../../../../core/services/swapi.service';
import { of, throwError } from 'rxjs';
import { Starship } from '../../../../core/models/starship.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StarshipsListComponent', () => {
  let component: StarshipsListComponent;
  let fixture: ComponentFixture<StarshipsListComponent>;
  let swapiService: jest.Mocked<SwapiService>;

  const mockStarships: Starship[] = [
    {
      name: 'X-wing',
      model: 'T-65 X-wing',
      manufacturer: 'Incom Corporation',
      cost_in_credits: '149999',
      length: '12.5',
      max_atmosphering_speed: '1050',
      crew: '1',
      passengers: '0',
      cargo_capacity: '110',
      consumables: '1 week',
      hyperdrive_rating: '1.0',
      MGLT: '100',
      starship_class: 'Starfighter',
      pilots: [],
      films: [],
      created: '2014-12-12T11:19:05.340000Z',
      edited: '2014-12-20T21:23:49.886000Z',
      url: 'https://swapi.info/api/starships/12'
    }
  ];

  beforeEach(async () => {
    const swapiServiceSpy = {
      getStarships: jest.fn()
    } as unknown as jest.Mocked<SwapiService>;

    await TestBed.configureTestingModule({
      imports: [StarshipsListComponent, BrowserAnimationsModule],
      providers: [
        { provide: SwapiService, useValue: swapiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StarshipsListComponent);
    component = fixture.componentInstance;
    swapiService = TestBed.inject(SwapiService) as jest.Mocked<SwapiService>;
    component.starshipUrls = ['https://swapi.info/api/starships/12'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load starships when panel is opened', () => {
    swapiService.getStarships.mockReturnValue(of(mockStarships));
    
    component.onPanelOpened();
    
    expect(swapiService.getStarships).toHaveBeenCalledWith(component.starshipUrls);
  });

  it('should display starships after loading', (done) => {
    swapiService.getStarships.mockReturnValue(of(mockStarships));
    
    component.onPanelOpened();
    
    component.starships$.subscribe(starships => {
      if (starships.length > 0) {
        expect(starships.length).toBe(1);
        expect(starships[0].name).toBe('X-wing');
        done();
      }
    });
  });

  it('should handle errors when loading starships', (done) => {
    const errorMessage = 'Failed to load starships';
    swapiService.getStarships.mockReturnValue(
      throwError(() => new Error(errorMessage))
    );
    
    component.onPanelOpened();
    
    component.loadingState$.subscribe(state => {
      if (state.error) {
        expect(state.error).toBe(errorMessage);
        done();
      }
    });
  });

  it('should only load starships once', () => {
    swapiService.getStarships.mockReturnValue(of(mockStarships));
    
    component.onPanelOpened();
    component.onPanelOpened();
    
    expect(swapiService.getStarships).toHaveBeenCalledTimes(1);
  });
});
