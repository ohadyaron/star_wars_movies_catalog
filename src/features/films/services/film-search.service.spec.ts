import { TestBed } from '@angular/core/testing';
import { FilmSearchService } from './film-search.service';

describe('FilmSearchService', () => {
  let service: FilmSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilmSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty search term', (done) => {
    service.searchTerm$.subscribe(term => {
      expect(term).toBe('');
      done();
    });
  });

  it('should update search term', (done) => {
    const searchTerm = 'A New Hope';
    service.setSearchTerm(searchTerm);

    service.searchTerm$.subscribe(term => {
      expect(term).toBe('a new hope');
      done();
    });
  });

  it('should convert search term to lowercase', () => {
    service.setSearchTerm('EMPIRE STRIKES BACK');
    expect(service.getCurrentSearchTerm()).toBe('empire strikes back');
  });

  it('should trim search term', () => {
    service.setSearchTerm('  Return of the Jedi  ');
    expect(service.getCurrentSearchTerm()).toBe('return of the jedi');
  });

  it('should emit multiple search terms', () => {
    const emittedValues: string[] = [];
    
    service.searchTerm$.subscribe(term => {
      emittedValues.push(term);
    });

    service.setSearchTerm('Hope');
    service.setSearchTerm('Empire');
    service.setSearchTerm('Jedi');

    expect(emittedValues).toEqual(['', 'hope', 'empire', 'jedi']);
  });
});
