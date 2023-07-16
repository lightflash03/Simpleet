import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallButtonsComponent } from './call-buttons.component';

describe('CallButtonsComponent', () => {
  let component: CallButtonsComponent;
  let fixture: ComponentFixture<CallButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallButtonsComponent]
    });
    fixture = TestBed.createComponent(CallButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
