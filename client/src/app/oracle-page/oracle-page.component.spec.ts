import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OraclePageComponent } from './oracle-page.component';

describe('OraclePageComponent', () => {
  let component: OraclePageComponent;
  let fixture: ComponentFixture<OraclePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OraclePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OraclePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
