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

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MenuModule,
    ButtonModule

  ],

  providers: [
    // InputMeetingService
  ],

  declarations: [
    SideBarComponent,
    HeaderComponent,
    FooterComponent
  ],
  exports: [
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    MenuModule,
    ButtonModule
  ]

  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
