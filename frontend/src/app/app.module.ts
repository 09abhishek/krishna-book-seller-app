import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { AppService } from './app.serveice';
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './providers/interceptor/request.interceptor';
import { APP_BASE_HREF } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AuthGuard } from './providers/guards/auth.guard';
import { ToastModule } from 'primeng/toast';
import { ConfirmationDialogService } from './shared/components/confirmation-dialog/confirmation-dialog.service';

@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    FullLayoutComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ToastModule,
  ],
  providers: [
    AppService,
    ConfirmationDialogService,
    AuthGuard,
    {
      provide: APP_BASE_HREF,
      useValue: ''
  },
    {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true},
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
