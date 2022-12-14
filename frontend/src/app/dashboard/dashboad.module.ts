import { DashboardComponent } from './dashboard.component';
import { SharedModule } from './../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// components


export const routes = [
    {
        path: '',
        component: DashboardComponent,
    }
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      FormsModule,
      ReactiveFormsModule,
      // HttpClientModule,
      SharedModule,
      NgxChartsModule
    ],
    declarations: [
      DashboardComponent
    ],
    providers: [
      DashboardService
    ]

})
export class DashboardModule {
}
