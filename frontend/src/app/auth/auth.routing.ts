import { LoginComponent } from './login/login.component';
import { Routes, RouterModule }  from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  ];
  export const routing = RouterModule.forChild(routes);
