import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SwapiService } from './swapi.service';
import { Film } from '../models/film.model';
import { Character } from '../models/character.model';
import { Starship } from '../models/starship.model';
import { Vehicle } from '../models/vehicle.model';
import { Species } from '../models/species.model';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://swapi.info/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SwapiService
      ]
    });

    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllFilms', () => {
    it('should fetch all films successfully', () => {
      const mockFilms: Film[] = [
        {
          title: 'A New Hope',
          episode_id: 4,
          opening_crawl: 'It is a period of civil war...',
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
        }
      ];

      service.getAllFilms().subscribe(films => {
        expect(films).toEqual(mockFilms);
        expect(films.length).toBe(1);
        expect(films[0].title).toBe('A New Hope');
      });

      const req = httpMock.expectOne(`${baseUrl}/films`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFilms);
    });

    it('should handle HTTP errors gracefully', () => {
      service.getAllFilms().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/films`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getCharacters', () => {
    it('should fetch multiple characters in parallel', () => {
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
        },
        {
          name: 'Leia Organa',
          height: '150',
          mass: '49',
          hair_color: 'brown',
          skin_color: 'light',
          eye_color: 'brown',
          birth_year: '19BBY',
          gender: 'female',
          homeworld: 'https://swapi.info/api/planets/2',
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: '2014-12-10T15:20:09.791000Z',
          edited: '2014-12-20T21:17:50.315000Z',
          url: 'https://swapi.info/api/people/5'
        }
      ];

      const urls = [
        'https://swapi.info/api/people/1',
        'https://swapi.info/api/people/5'
      ];

      service.getCharacters(urls).subscribe(characters => {
        expect(characters.length).toBe(2);
        expect(characters[0].name).toBe('Luke Skywalker');
        expect(characters[1].name).toBe('Leia Organa');
      });

      const req1 = httpMock.expectOne(urls[0]);
      const req2 = httpMock.expectOne(urls[1]);
      
      req1.flush(mockCharacters[0]);
      req2.flush(mockCharacters[1]);
    });

    it('should return empty array for empty URLs', () => {
      service.getCharacters([]).subscribe(characters => {
        expect(characters).toEqual([]);
      });

      httpMock.expectNone(() => true);
    });

    it('should filter out failed character requests', () => {
      const mockCharacter: Character = {
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
      };

      const urls = [
        'https://swapi.info/api/people/1',
        'https://swapi.info/api/people/999'
      ];

      service.getCharacters(urls).subscribe(characters => {
        expect(characters.length).toBe(1);
        expect(characters[0].name).toBe('Luke Skywalker');
      });

      const req1 = httpMock.expectOne(urls[0]);
      const req2 = httpMock.expectOne(urls[1]);
      
      req1.flush(mockCharacter);
      req2.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getStarships', () => {
    it('should fetch multiple starships in parallel', () => {
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

      const urls = ['https://swapi.info/api/starships/12'];

      service.getStarships(urls).subscribe(starships => {
        expect(starships.length).toBe(1);
        expect(starships[0].name).toBe('X-wing');
      });

      const req = httpMock.expectOne(urls[0]);
      req.flush(mockStarships[0]);
    });

    it('should return empty array for empty URLs', () => {
      service.getStarships([]).subscribe(starships => {
        expect(starships).toEqual([]);
      });

      httpMock.expectNone(() => true);
    });
  });

  describe('getVehicles', () => {
    it('should fetch multiple vehicles in parallel', () => {
      const mockVehicles: Vehicle[] = [
        {
          name: 'Sand Crawler',
          model: 'Digger Crawler',
          manufacturer: 'Corellia Mining Corporation',
          cost_in_credits: '150000',
          length: '36.8',
          max_atmosphering_speed: '30',
          crew: '46',
          passengers: '30',
          cargo_capacity: '50000',
          consumables: '2 months',
          vehicle_class: 'wheeled',
          pilots: [],
          films: [],
          created: '2014-12-10T15:36:25.724000Z',
          edited: '2014-12-20T21:30:21.661000Z',
          url: 'https://swapi.info/api/vehicles/4'
        }
      ];

      const urls = ['https://swapi.info/api/vehicles/4'];

      service.getVehicles(urls).subscribe(vehicles => {
        expect(vehicles.length).toBe(1);
        expect(vehicles[0].name).toBe('Sand Crawler');
      });

      const req = httpMock.expectOne(urls[0]);
      req.flush(mockVehicles[0]);
    });

    it('should return empty array for empty URLs', () => {
      service.getVehicles([]).subscribe(vehicles => {
        expect(vehicles).toEqual([]);
      });

      httpMock.expectNone(() => true);
    });
  });

  describe('getSpecies', () => {
    it('should fetch multiple species in parallel', () => {
      const mockSpecies: Species[] = [
        {
          name: 'Human',
          classification: 'mammal',
          designation: 'sentient',
          average_height: '180',
          skin_colors: 'caucasian, black, asian, hispanic',
          hair_colors: 'blonde, brown, black, red',
          eye_colors: 'brown, blue, green, hazel, grey, amber',
          average_lifespan: '120',
          homeworld: 'https://swapi.info/api/planets/9',
          language: 'Galactic Basic',
          people: [],
          films: [],
          created: '2014-12-10T13:52:11.567000Z',
          edited: '2014-12-20T21:36:42.136000Z',
          url: 'https://swapi.info/api/species/1'
        }
      ];

      const urls = ['https://swapi.info/api/species/1'];

      service.getSpecies(urls).subscribe(species => {
        expect(species.length).toBe(1);
        expect(species[0].name).toBe('Human');
      });

      const req = httpMock.expectOne(urls[0]);
      req.flush(mockSpecies[0]);
    });

    it('should return empty array for empty URLs', () => {
      service.getSpecies([]).subscribe(species => {
        expect(species).toEqual([]);
      });

      httpMock.expectNone(() => true);
    });
  });
});
