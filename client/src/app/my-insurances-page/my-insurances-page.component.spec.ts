import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInsurancesPageComponent } from './my-insurances-page.component';

describe('MyInsurancesPageComponent', () => {
  let component: MyInsurancesPageComponent;
  let fixture: ComponentFixture<MyInsurancesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInsurancesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInsurancesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
