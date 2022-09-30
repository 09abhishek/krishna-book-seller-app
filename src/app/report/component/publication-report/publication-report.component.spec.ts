import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationReportComponent } from './publication-report.component';

describe('PublicationReportComponent', () => {
  let component: PublicationReportComponent;
  let fixture: ComponentFixture<PublicationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
