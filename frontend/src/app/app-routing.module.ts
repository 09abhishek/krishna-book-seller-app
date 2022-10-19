import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { AuthGuard } from './providers/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    children: [
        {
          path: 'report',
          canActivate: [AuthGuard],
          loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
        },
        {
          path: 'invoice',
          canActivate: [AuthGuard],
          loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule)
        },
        {
          path: 'dashboard',
          canActivate: [AuthGuard],
          loadChildren: () => import('./dashboard/dashboad.module').then(m => m.DashboardModule)
        },
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        }
    ]
  },
  // { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)  }
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
