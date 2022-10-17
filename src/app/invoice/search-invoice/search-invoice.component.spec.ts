import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInvoiceComponent } from './search-invoice.component';

describe('SearchInvoiceComponent', () => {
  let component: SearchInvoiceComponent;
  let fixture: ComponentFixture<SearchInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
