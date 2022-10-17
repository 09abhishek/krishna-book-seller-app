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

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MenuModule,
    ButtonModule,
    CalendarModule,
    TableModule
  ],

  providers: [
    // InputMeetingService
  ],

  declarations: [
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    OnlyNumberDirective
  ],
  exports: [
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    MenuModule,
    ButtonModule,
    CalendarModule,
    TableModule,
    OnlyNumberDirective
  ]

  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
