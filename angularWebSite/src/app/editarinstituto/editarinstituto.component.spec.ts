import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarinstitutoComponent } from './editarinstituto.component';

describe('EditarinstitutoComponent', () => {
  let component: EditarinstitutoComponent;
  let fixture: ComponentFixture<EditarinstitutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarinstitutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarinstitutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
