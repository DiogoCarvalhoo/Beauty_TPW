import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarprodutoComponent } from './editarproduto.component';

describe('EditarprodutoComponent', () => {
  let component: EditarprodutoComponent;
  let fixture: ComponentFixture<EditarprodutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarprodutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarprodutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
