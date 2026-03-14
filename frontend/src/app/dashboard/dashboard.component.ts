import { invoice, revenue, total_sale, total_sales } from './base64.images';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from './dashboard.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import {each, groupBy} from 'lodash';
import { dashBorardClassList } from '../shared/class-list';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  basicData: any;
  bookListByClass: any = {};
  basicOptions: any;
  lastTenInvoiceList: any = [];
  loading = false;

  data: any = {};
  totalBillbyClassConfig: any;
  totalBillbyClassData: any = {};

  basicDailyCollectionLine: any;
  basicDailyCollectionData: any = {};

  basiGrandCollectionLine: any;
  basicGrandCollectionData: any = {};

  todayDate: any = new Date();
  private subscriptions: any = {};
  userCount: any = 0;
  invoiceCount: any = 0;
  netSellCount: any = 0;
  totalSellCount: any = 0;
  revenue: any = 0;
  totalNumberBillByClass: any = {};
  classId: any = 'nursery';
  bookListData: any = [];
  classList: any = dashBorardClassList;
  total_sales: string = total_sales;
  total_sale: string = total_sale;
  invoice: string = invoice;
  revenueimage: string = revenue;
  colorScheme: any = {
    domain: ['#42A5F5', "#66BB6A","#FFA726",'#ff4000', '#00ffbf']
  };
  view: any= [500, 400];
  constructor(public dashboardService: DashboardService) { }

  ngOnInit(): void {
  this.basicOptions = {
    plugins: {
        legend: {
          display: false,
          position: "top",
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            },
              scaleLabel: {
                display: true,
                labelString: '% Cases/Status',
                fontColor: '#757575',
                fontSize: 12
              }
        },
        yAxes: [
          {
            ticks: {
              callback: (label: any, index: any, labels: any) => {
                return label + '%';
              }
            }
          }
        ]
    }
};
    this.totalBillbyClassConfig = {
      cutout: '60%',
      plugins: {
        legend: {
          display: true,
          position: 'left',
          labels: {
            color: '#334155',
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 8,
            font: {
              size: 13,
              family: "'Nunito', sans-serif"
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return ` ${context.label}`;
            }
          }
        }
      }
    };
this.basicDailyCollectionLine = {
  plugins: {
      legend: {
        display: false,
          labels: {
              color: '#495057'
          }
      }
  },
  scales: {
      x: {
          ticks: {
              color: '#495057'
          },
          grid: {
              color: '#ebedef'
          },
      },
      y: {
          ticks: {
              color: '#495057'
          },
          grid: {
              color: '#ebedef'
          },
      },
  }
}
this.basiGrandCollectionLine = {
  plugins: {
      legend: {
        display: false,
          labels: {
              color: '#495057'
          }
      }
  },
  scales: {
      x: {
          ticks: {
              color: '#495057'
          },
          grid: {
              color: '#ebedef'
          }
      },
      y: {
          ticks: {
              color: '#495057'
          },
          grid: {
              color: '#ebedef'
          }
      }
  }
}

    this.dailyCollectionGraph();
    this.totalMrpNetPriceDetails();
    this.grandCollectionGraph();
    this.getUserList();
    this.getInvoiceList();
    this.getTotaSellCount();
    this.onChangeClass();
    this.getLastTenInvoiceList();
  }
  totalMrpNetPriceDetails() {
    const params: any = {};
    params.from = moment().subtract(1, 'years').format('YYYY-MM-DD');
    params.to = moment(this.todayDate).format('YYYY-MM-DD');

    this.subscriptions['gettotalCollection'] = this.dashboardService.searchInvoice(params).subscribe({
      next: (res: any) => {
        if(res && res.data) {
          this.netSellCount = res.data.sum_of_net_amount ? res.data.sum_of_net_amount : 0;
          this.totalSellCount= res.data.sum_of_totals ? res.data.sum_of_totals : 0;
          this.revenue= (parseFloat(res.data.sum_of_totals) - parseFloat(res.data.sum_of_net_amount)).toFixed(2);
        }
      },
      error: (error: any) => {
      },
      complete: () => {
      }
    });
  }
  dailyCollectionGraph() {
    const dailyParams: any = {};
    dailyParams.labels = [];
    dailyParams.datasets = [];

    const params: any = {};
    params.from = moment(this.todayDate).format('YYYY-MM-DD');
    params.to = moment(this.todayDate).format('YYYY-MM-DD');

    this.subscriptions['getCollection'] = this.dashboardService.searchInvoice(params).subscribe({
      next: (res: any) => {
        if(res && res.data && res.data.invoice) {
          const datasetparams: any = {};
          datasetparams.data = [];
          datasetparams.tension = .4;
          datasetparams.borderColor = '#42A5F5';
          datasetparams.fill = false;
          datasetparams.label = 'Bill Amount';

          res.data.invoice.forEach((item: any) => {
            datasetparams.data.push(item.total_amount);
            dailyParams.labels.push(moment(item.created_at).format('hh:mm A'));
          });
          dailyParams.datasets.push(datasetparams);
          this.basicDailyCollectionData = dailyParams;
        }
      },
      error: (error: any) => {
      },
      complete: () => {
      }
    });
  }
  grandCollectionGraph() {
    const grandParams: any = {};
    grandParams.labels = [];
    grandParams.datasets = [];

    const params: any = {};
    params.to = moment(this.todayDate).format('YYYY-MM-DD');
    params.from = moment().subtract(1,'months').format('YYYY-MM-DD');

    this.subscriptions['getGrandCollection'] = this.dashboardService.dailyCollectionInvoice(params).subscribe({
      next: (res: any) => {
        if(res && res.data && res.data.invoice) {
          const datasetparams: any = {};
          datasetparams.data = [];
          datasetparams.tension = .4;
          datasetparams.borderColor = '#FFA726';
          datasetparams.fill = false;
          datasetparams.label = 'Collection Amount';

          res.data.invoice.forEach((item: any) => {
            const dateValue = item.date.split('-');
            datasetparams.data.push(item.total_amount);
            grandParams.labels.push(`${dateValue[0]}-${this.getMonthName(dateValue[1])} `);
          });
          grandParams.datasets.push(datasetparams);
          this.basicGrandCollectionData = grandParams;
        }
      },
      error: (error: any) => {
      },
      complete: () => {
      }
    });
  }
  getUserList() {
    this.subscriptions['getuserList'] = this.dashboardService.userList().subscribe({
      next: (res: any) => {
        if(res && res.data) {
          this.userCount = res.data.length;
        }
      },
    });
  }

  getInvoiceList() {
    this.subscriptions['getInvoiceList'] = this.dashboardService.totalInvoice().subscribe({
      next: (res: any) => {
        this.totalNumberBillByClass = {};
        const params: any = {};
        params.labels = [];
        params.datasets = [];

        if(res && res.data) {
          const datasetparams: any = {};
          datasetparams.data = [];
          datasetparams.backgroundColor = [
            "#4F46E5", // Indigo
            "#06B6D4", // Cyan
            "#10B981", // Emerald Green
            "#F59E0B", // Amber/Orange
            "#EF4444", // Red
            "#8B5CF6", // Purple
            "#EC4899", // Pink
            "#14B8A6", // Teal
            "#F97316", // Bright Orange
            "#0EA5E9", // Light Blue
            "#84CC16", // Lime
            "#6366F1"  // Soft Indigo
          ];
          datasetparams.borderWidth = 0;
          datasetparams.hoverOffset = 4;

          if(res.data && res.data.invoice) {
            this.totalNumberBillByClass = groupBy(res.data.invoice, 'class');
            let chartData: any[] = [];
            this.classList.forEach((item: any) => {
              let billCount = 0;
              if (this.totalNumberBillByClass[item.name]) {
                billCount = parseInt(this.totalNumberBillByClass[item.name][0].no_of_bills) || 0;
              }
              if (billCount > 0) {
                const className = this.getClassNo(this.classList, item.name) || item.className;
                chartData.push({ name: className, count: billCount });
              }
            });
            chartData.sort((a, b) => b.count - a.count);
            chartData.forEach(item => {
              params.labels.push(`${item.name} (${item.count})`);
              datasetparams.data.push(item.count);
            });

            params.datasets.push(datasetparams);
            this.totalBillbyClassData = params;
          }
          this.invoiceCount = res.data.sum_of_totals;
        }
      },
    });
  }

  getTotaSellCount() {
    const params: any = {};
    params.to = moment(this.todayDate).format('YYYY-MM-DD');
    params.from = moment().subtract(1,'months').format('YYYY-MM-DD');

    this.subscriptions['getTotaSellCount'] = this.dashboardService.dailyCollectionInvoice(params).subscribe({
      next: (res: any) => {
        if(res && res.data) {
        }
      },
    });
  }
  onChangeClass() {
    const parms: any = {};
    parms.labels = [];
    parms.datasets = [];

    this.subscriptions['bookList'] = this.dashboardService.getBookByClass(this.classId)
    .subscribe((item: any) => {
          this.bookListData = [];
          const datasetparams: any = {};
          datasetparams.data = [];
          datasetparams.label = 'Quantity';
          datasetparams.backgroundColor = '#42A5F5';
          if (item && item.data) {
            item.data.forEach((iteam: any) => {
              parms.labels.push(iteam.name);
              datasetparams.data.push(iteam.quantity);
              this.bookListData.push({'name': iteam.name, 'value': iteam.quantity})
            });
            parms.datasets.push(datasetparams);
            this.bookListByClass = parms;
          }
    });
  }
  getLastTenInvoiceList() {
    this.subscriptions['lastInvoice'] = this.dashboardService.getLatestInvoice()
    .subscribe((item: any) => {
          if (item && item.data) {
            this.lastTenInvoiceList = item.data;
          }
    });
  }
  getMonthName(monthNumber: any) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'short' });
  }

  getClassNo(list: any, classNo: any): any {
    let val = '';
    list.forEach((item: any) => {
      if (item.name == classNo) {
        val = item.className;
      }
    });
    return val;
  }
  checkEmptyData() {
    if(Object.keys(this.totalBillbyClassData).length == 0) {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy(): void {
    each(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
