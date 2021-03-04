import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InseririnstitutoComponent } from './inseririnstituto.component';

describe('InseririnstitutoComponent', () => {
  let component: InseririnstitutoComponent;
  let fixture: ComponentFixture<InseririnstitutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InseririnstitutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InseririnstitutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
