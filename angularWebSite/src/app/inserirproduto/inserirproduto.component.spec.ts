import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirprodutoComponent } from './inserirproduto.component';

describe('InserirprodutoComponent', () => {
  let component: InserirprodutoComponent;
  let fixture: ComponentFixture<InserirprodutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserirprodutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirprodutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
