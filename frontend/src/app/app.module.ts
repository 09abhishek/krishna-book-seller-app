import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    FullLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
