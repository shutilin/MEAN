import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanficsComponent } from './fanfics.component';

describe('FanficsComponent', () => {
  let component: FanficsComponent;
  let fixture: ComponentFixture<FanficsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanficsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanficsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
