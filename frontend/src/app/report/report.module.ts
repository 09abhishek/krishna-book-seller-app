import { routing } from './report.routing';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CollectionReportComponent } from './component/collection-report/collection-report.component';
import { BookStockReportComponent } from './component/book-stock-report/book-stock-report.component';
import { PublicationReportComponent } from './component/publication-report/publication-report.component';
import { AllBookListComponent } from './component/all-book-list/all-book-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    SharedModule
  ],

  providers: [
    // InputMeetingService
  ],

  declarations: [
    CollectionReportComponent,
    BookStockReportComponent,
    PublicationReportComponent,
    AllBookListComponent,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReportModule { }
