import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default error message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const errorText = compiled.querySelector('.error-text');
    expect(errorText?.textContent).toContain('An error occurred');
  });

  it('should display custom error message', () => {
    fixture.componentRef.setInput('message', 'Failed to load data');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const errorText = compiled.querySelector('.error-text');
    expect(errorText?.textContent).toContain('Failed to load data');
  });
});
