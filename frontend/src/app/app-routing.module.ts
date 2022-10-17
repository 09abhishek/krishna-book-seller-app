import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    children: [
        { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) },
        { path: 'invoice', loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule) },
        {
          path: '',
          redirectTo: 'report',
          pathMatch: 'full'
        }
    ]
  },
  // { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)  }
  {
    path: 'login',
    component: LoginComponent
  }
  // { path: '**', component:notfound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
