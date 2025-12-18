import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('.loading-message');
    expect(message?.textContent).toContain('Loading...');
  });

  it('should display custom message when provided', () => {
    component.message = 'Please wait...';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('.loading-message');
    expect(message?.textContent).toContain('Please wait...');
  });

  it('should use default diameter of 50', () => {
    expect(component.diameter).toBe(50);
  });

  it('should accept custom diameter', () => {
    component.diameter = 100;
    expect(component.diameter).toBe(100);
  });
});
