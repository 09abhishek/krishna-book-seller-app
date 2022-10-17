import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookStockReportComponent } from './book-stock-report.component';

describe('BookStockReportComponent', () => {
  let component: BookStockReportComponent;
  let fixture: ComponentFixture<BookStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookStockReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
