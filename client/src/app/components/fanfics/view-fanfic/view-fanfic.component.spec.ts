import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFanficComponent } from './view-fanfic.component';

describe('ViewFanficComponent', () => {
  let component: ViewFanficComponent;
  let fixture: ComponentFixture<ViewFanficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFanficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFanficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
