import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmsPageComponent } from './films-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FilmsPageComponent', () => {
  let component: FilmsPageComponent;
  let fixture: ComponentFixture<FilmsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilmsPageComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilmsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toolbar component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toolbar = compiled.querySelector('app-toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should render films grid component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const filmsGrid = compiled.querySelector('app-films-grid');
    expect(filmsGrid).toBeTruthy();
  });
});
