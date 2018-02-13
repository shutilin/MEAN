import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFanficComponent } from './delete-fanfic.component';

describe('DeleteFanficComponent', () => {
  let component: DeleteFanficComponent;
  let fixture: ComponentFixture<DeleteFanficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFanficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFanficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
