import { GrantTotalReportComponent } from './component/grant-total-report/grant-total-report.component';

import { Routes, RouterModule }  from '@angular/router';
import { AllBookListComponent } from './component/all-book-list/all-book-list.component';
import { BookStockReportComponent } from './component/book-stock-report/book-stock-report.component';
import { CollectionReportComponent } from './component/collection-report/collection-report.component';
import { PublicationReportComponent } from './component/publication-report/publication-report.component';


const routes: Routes = [
  { path: '', redirectTo: 'collection-report', pathMatch: 'full'},
  { path: 'collection-report', component: CollectionReportComponent},
  { path: 'grant-collection-report', component: GrantTotalReportComponent},
  { path: 'book-stock-report', component: BookStockReportComponent},
  { path: 'publication-report', component: PublicationReportComponent},
  { path: 'all-book-list', component: AllBookListComponent},
  ];
  export const routing = RouterModule.forChild(routes);
