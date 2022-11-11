import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ManageItemListComponent } from './manage-item-list/manage-item-list.component';
import { ManageItemUpdateComponent } from './manage-item-update/manage-item-update.component';
import { ManageQuantityComponent } from './manage-quantity/manage-quantity.component';
import { ManagePublicationListComponent } from './manage-publication-list/manage-publication-list.component';
import { ManagePublicationUpdateComponent } from './manage-publication-update/manage-publication-update.component';
import { routing } from './book-management.routing';
import { BookManagementService } from './book-management.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    SharedModule,
    routing
  ],

  providers: [
    BookManagementService
  ],

  declarations: [
    ManageItemListComponent,
    ManageItemUpdateComponent,
    ManageQuantityComponent,
    ManagePublicationListComponent,
    ManagePublicationUpdateComponent,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BookManagementModule { }
