import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { routing } from './invoice.routing';
import { SearchInvoiceComponent } from './search-invoice/search-invoice.component';
import { InvoiceService } from './invoice.service';
import { InvoicePrintService } from './invoice/invoice-print.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    routing
  ],

  providers: [
    InvoiceService,
    InvoicePrintService
  ],

  declarations: [
    InvoiceComponent,
    SearchInvoiceComponent
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceModule { }
