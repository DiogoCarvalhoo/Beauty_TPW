import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilcontaComponent } from './perfilconta.component';

describe('PerfilcontaComponent', () => {
  let component: PerfilcontaComponent;
  let fixture: ComponentFixture<PerfilcontaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilcontaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilcontaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
