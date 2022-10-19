import { LoginComponent } from './login/login.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { routing } from './auth.routing';


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
    // LoginComponent
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule { }
