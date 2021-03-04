import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaostaffComponent } from './gestaostaff.component';

describe('GestaostaffComponent', () => {
  let component: GestaostaffComponent;
  let fixture: ComponentFixture<GestaostaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestaostaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestaostaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
