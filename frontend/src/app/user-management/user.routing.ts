import { ViewProfileComponent } from './view-profile/view-profile.component';
import { Routes, RouterModule }  from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { UserListComponent } from './user-list/user-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'add', component: AddUserComponent},
  { path: 'list', component: UserListComponent},
  { path: 'update/:id', component: AddUserComponent},
  { path: 'profile', component: ViewProfileComponent},
  ];
  export const routing = RouterModule.forChild(routes);
