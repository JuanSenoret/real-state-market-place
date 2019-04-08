import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarHomeComponent } from './snackbar-home.component';

describe('SnackbarHomeComponent', () => {
  let component: SnackbarHomeComponent;
  let fixture: ComponentFixture<SnackbarHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
