import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoinstitutosComponent } from './gestaoinstitutos.component';

describe('GestaoinstitutosComponent', () => {
  let component: GestaoinstitutosComponent;
  let fixture: ComponentFixture<GestaoinstitutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestaoinstitutosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestaoinstitutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
