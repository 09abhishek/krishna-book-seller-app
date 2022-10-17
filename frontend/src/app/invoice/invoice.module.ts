import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { routing } from './invoice.routing';
import { SearchInvoiceComponent } from './search-invoice/search-invoice.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    routing
  ],

  providers: [
    // InputMeetingService
  ],

  declarations: [
    InvoiceComponent,
    SearchInvoiceComponent
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceModule { }
