
import { Routes, RouterModule }  from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: InvoiceComponent},
  ];
  export const routing = RouterModule.forChild(routes);
