import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import {MenuModule} from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import { OnlyNumberDirective } from './directive/only-number.directive';
import {ChartModule} from 'primeng/chart';
import { LoaderComponent } from './components/loader/loader.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MenuModule,
    ButtonModule,
    CalendarModule,
    TableModule,
    ChartModule,
    NgbModule
  ],

  providers: [
    // AppService
  ],

  declarations: [
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    OnlyNumberDirective,
    LoaderComponent,
    ConfirmationDialogComponent
  ],
  exports: [
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    MenuModule,
    ButtonModule,
    CalendarModule,
    TableModule,
    OnlyNumberDirective,
    ChartModule,
    LoaderComponent,
    NgbModule
  ],

  entryComponents: [ConfirmationDialogComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
