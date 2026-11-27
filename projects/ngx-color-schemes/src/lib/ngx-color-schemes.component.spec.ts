import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxColorSchemesComponent } from './ngx-color-schemes.component';

describe('NgxColorSchemesComponent', () => {
  let component: NgxColorSchemesComponent;
  let fixture: ComponentFixture<NgxColorSchemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NgxColorSchemesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxColorSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the icon with the given size', () => {
    const svg: SVGElement | null = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('32');
  });
});
