import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarservicoComponent } from './editarservico.component';

describe('EditarservicoComponent', () => {
  let component: EditarservicoComponent;
  let fixture: ComponentFixture<EditarservicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarservicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarservicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
