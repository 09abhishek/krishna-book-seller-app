import { Routes, RouterModule }  from '@angular/router';
import { ManageItemListComponent } from './manage-item-list/manage-item-list.component';
import { ManageItemUpdateComponent } from './manage-item-update/manage-item-update.component';
import { ManagePublicationListComponent } from './manage-publication-list/manage-publication-list.component';
import { ManagePublicationUpdateComponent } from './manage-publication-update/manage-publication-update.component';
import { ManageQuantityComponent } from './manage-quantity/manage-quantity.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'manage-item', component: ManageItemListComponent},
  { path: 'manage-item-update', component: ManageItemUpdateComponent},
  { path: 'manage-quantity', component: ManageQuantityComponent},
  { path: 'manage-publication', component: ManagePublicationListComponent},
  { path: 'manage-publication-update', component: ManagePublicationUpdateComponent},
  ];
  export const routing = RouterModule.forChild(routes);
