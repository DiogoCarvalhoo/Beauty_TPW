import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirservicoComponent } from './inserirservico.component';

describe('InserirservicoComponent', () => {
  let component: InserirservicoComponent;
  let fixture: ComponentFixture<InserirservicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserirservicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirservicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
