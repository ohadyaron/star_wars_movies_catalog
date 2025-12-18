import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { FilmSearchService } from '../../services/film-search.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let filmSearchService: jasmine.SpyObj<FilmSearchService>;

  beforeEach(async () => {
    const filmSearchServiceSpy = jasmine.createSpyObj('FilmSearchService', ['setSearchTerm']);

    await TestBed.configureTestingModule({
      imports: [ToolbarComponent, BrowserAnimationsModule],
      providers: [
        { provide: FilmSearchService, useValue: filmSearchServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    filmSearchService = TestBed.inject(FilmSearchService) as jasmine.SpyObj<FilmSearchService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.app-title');
    expect(title?.textContent).toContain('Star Wars Films Catalog');
  });

  it('should have search input field', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input[type="text"]');
    expect(input).toBeTruthy();
  });

  it('should debounce search term updates', (done) => {
    const searchTerm = 'A New Hope';
    
    component.searchControl.setValue(searchTerm);
    
    setTimeout(() => {
      expect(filmSearchService.setSearchTerm).toHaveBeenCalledWith(searchTerm);
      done();
    }, 350);
  });

  it('should not update search term before debounce time', (done) => {
    const searchTerm = 'Empire';
    
    component.searchControl.setValue(searchTerm);
    
    setTimeout(() => {
      expect(filmSearchService.setSearchTerm).not.toHaveBeenCalled();
    }, 100);

    setTimeout(() => {
      expect(filmSearchService.setSearchTerm).toHaveBeenCalledWith(searchTerm);
      done();
    }, 350);
  });

  it('should only emit distinct search terms', (done) => {
    component.searchControl.setValue('Jedi');
    
    setTimeout(() => {
      filmSearchService.setSearchTerm.calls.reset();
      component.searchControl.setValue('Jedi');
      
      setTimeout(() => {
        expect(filmSearchService.setSearchTerm).not.toHaveBeenCalled();
        done();
      }, 350);
    }, 350);
  });
});
