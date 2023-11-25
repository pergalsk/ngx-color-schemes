import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxColorSchemesComponent } from './ngx-color-schemes.component';

describe('NgxColorSchemesComponent', () => {
  let component: NgxColorSchemesComponent;
  let fixture: ComponentFixture<NgxColorSchemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxColorSchemesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxColorSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
