import { ImportExportComponent } from './import-export/import-export.component';
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
          path: 'user',
          canActivate: [AuthGuard],
          loadChildren: () => import('./user-management/user.module').then(m => m.UserModule)
        },
        {
          path: 'book-management',
          canActivate: [AuthGuard],
          loadChildren: () => import('./book-management/book-management.module').then(m => m.BookManagementModule)
        },
        {
          path: 'import-export',
          component: ImportExportComponent,
          canActivate: [AuthGuard],
        },
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        }
    ]
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
