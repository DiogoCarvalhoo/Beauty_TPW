import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutoslistComponent } from './institutoslist.component';

describe('InstitutoslistComponent', () => {
  let component: InstitutoslistComponent;
  let fixture: ComponentFixture<InstitutoslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutoslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutoslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
