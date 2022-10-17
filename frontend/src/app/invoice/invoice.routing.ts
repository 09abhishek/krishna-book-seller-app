import { SearchInvoiceComponent } from './search-invoice/search-invoice.component';

import { Routes, RouterModule }  from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: InvoiceComponent},
  { path: 'search-invoice', component: SearchInvoiceComponent},
  ];
  export const routing = RouterModule.forChild(routes);
