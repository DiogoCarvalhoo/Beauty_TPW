import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoservicosComponent } from './gestaoservicos.component';

describe('GestaoservicosComponent', () => {
  let component: GestaoservicosComponent;
  let fixture: ComponentFixture<GestaoservicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestaoservicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestaoservicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
