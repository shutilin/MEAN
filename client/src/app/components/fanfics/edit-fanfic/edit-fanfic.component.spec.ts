import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFanficComponent } from './edit-fanfic.component';

describe('EditFanficComponent', () => {
  let component: EditFanficComponent;
  let fixture: ComponentFixture<EditFanficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFanficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFanficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
