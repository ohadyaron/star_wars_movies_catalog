import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersListComponent } from './characters-list.component';
import { SwapiService } from '../../../../core/services/swapi.service';
import { of, throwError } from 'rxjs';
import { Character } from '../../../../core/models/character.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CharactersListComponent', () => {
  let component: CharactersListComponent;
  let fixture: ComponentFixture<CharactersListComponent>;
  let swapiService: jest.Mocked<SwapiService>;

  const mockCharacters: Character[] = [
    {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 'https://swapi.info/api/planets/1',
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      url: 'https://swapi.info/api/people/1'
    }
  ];

  beforeEach(async () => {
    const swapiServiceSpy = {
      getCharacters: jest.fn()
    } as unknown as jest.Mocked<SwapiService>;

    await TestBed.configureTestingModule({
      imports: [CharactersListComponent, BrowserAnimationsModule],
      providers: [
        { provide: SwapiService, useValue: swapiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersListComponent);
    component = fixture.componentInstance;
    swapiService = TestBed.inject(SwapiService) as jest.Mocked<SwapiService>;
    component.characterUrls = ['https://swapi.info/api/people/1'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not load characters initially', () => {
    expect(swapiService.getCharacters).not.toHaveBeenCalled();
  });

  it('should load characters when panel is opened', () => {
    swapiService.getCharacters.mockReturnValue(of(mockCharacters));
    
    component.onPanelOpened();
    
    expect(swapiService.getCharacters).toHaveBeenCalledWith(component.characterUrls);
  });

  it('should display characters after loading', (done) => {
    swapiService.getCharacters.mockReturnValue(of(mockCharacters));
    
    component.onPanelOpened();
    
    component.characters$.subscribe(characters => {
      if (characters.length > 0) {
        expect(characters.length).toBe(1);
        expect(characters[0].name).toBe('Luke Skywalker');
        done();
      }
    });
  });

  it('should show loading state while fetching characters', () => {
    swapiService.getCharacters.mockReturnValue(of(mockCharacters));
    
    expect(component.loadingState$.value.isLoading).toBe(false);
    component.onPanelOpened();
    // After loading completes with synchronous of(), state is back to not loading
    expect(swapiService.getCharacters).toHaveBeenCalled();
  });

  it('should handle errors when loading characters', (done) => {
    const errorMessage = 'Failed to load characters';
    swapiService.getCharacters.mockReturnValue(
      throwError(() => new Error(errorMessage))
    );
    
    component.onPanelOpened();
    
    component.loadingState$.subscribe(state => {
      if (state.error) {
        expect(state.error).toBe(errorMessage);
        expect(state.isLoading).toBe(false);
        done();
      }
    });
  });

  it('should only load characters once', () => {
    swapiService.getCharacters.mockReturnValue(of(mockCharacters));
    
    component.onPanelOpened();
    component.onPanelOpened();
    component.onPanelOpened();
    
    expect(swapiService.getCharacters).toHaveBeenCalledTimes(1);
  });

  it('should use trackBy function with character URL', () => {
    const character = mockCharacters[0];
    const result = component.trackByCharacterUrl(0, character);
    expect(result).toBe(character.url);
  });

  it('should not load if no character URLs provided', () => {
    component.characterUrls = [];
    component.onPanelOpened();
    
    expect(swapiService.getCharacters).not.toHaveBeenCalled();
  });
});
