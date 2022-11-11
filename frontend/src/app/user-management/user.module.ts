import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { routing } from './user.routing';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './user.service';
import { ViewProfileComponent } from './view-profile/view-profile.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    routing
  ],

  providers: [
    UserService
  ],

  declarations: [
    AddUserComponent,
    UserListComponent,
    ViewProfileComponent
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule { }
