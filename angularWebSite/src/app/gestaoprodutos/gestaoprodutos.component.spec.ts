import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoprodutosComponent } from './gestaoprodutos.component';

describe('GestaoprodutosComponent', () => {
  let component: GestaoprodutosComponent;
  let fixture: ComponentFixture<GestaoprodutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestaoprodutosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestaoprodutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
