import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreareservadaComponent } from './areareservada.component';

describe('AreareservadaComponent', () => {
  let component: AreareservadaComponent;
  let fixture: ComponentFixture<AreareservadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreareservadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreareservadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
