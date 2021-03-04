import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirstaffComponent } from './inserirstaff.component';

describe('InserirstaffComponent', () => {
  let component: InserirstaffComponent;
  let fixture: ComponentFixture<InserirstaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserirstaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirstaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
