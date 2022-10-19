import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantTotalReportComponent } from './grant-total-report.component';

describe('GrantTotalReportComponent', () => {
  let component: GrantTotalReportComponent;
  let fixture: ComponentFixture<GrantTotalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantTotalReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantTotalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
