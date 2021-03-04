import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarstaffComponent } from './editarstaff.component';

describe('EditarstaffComponent', () => {
  let component: EditarstaffComponent;
  let fixture: ComponentFixture<EditarstaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarstaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarstaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
