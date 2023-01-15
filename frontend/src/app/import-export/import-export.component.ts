import { classList } from './../shared/class-list';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import {each, groupBy} from 'lodash';
import { AppService } from '../app.serveice';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent implements OnInit {

  fileValidationArray = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
  private subscriptions: any = {};
  printExportData: any = [];
  todayDate: any = new Date();
  totalAmount: any;
  collectionreportLoader = false;
  exportType: any = '';
  fileError = '';
  fileName = '';
  file: any;
  userDetails: any;
  classList: any = classList;
  constructor(public appService: AppService) {
    this.userDetails = localStorage.getItem('userDetails')  ? JSON.parse(localStorage.getItem('userDetails')!) : '';
   }

  ngOnInit(): void {
  }
  exportAllTypeExcel(type: string) {
    this.collectionreportLoader = true;
    this.exportType = type;
    const params: any = {};
    params.type = type;
    this.subscriptions['getExportType'] = this.appService.getAllExportTypeData(params).subscribe({
      next: (res: any) => {
        this.printExportData = [];
        if(res && res.data) {
        if (res && res.data && res.data.invoice && type == 'daily-collection') {
          res.data.invoice.forEach((item: any) => {
            const params: any = {};
              params.billno = item.id;
              params.billdate = item.date ? moment(item.date).format('DD-MMM-YYYY') : '';
              params.name = item.name;
              params.class = this.getClassNo(this.classList, item.class);
              params.totalamount = item.total_amount;
              this.printExportData.push(params);
          });
          this.totalAmount = res?.data?.sum_of_totals ? res?.data?.sum_of_totals : 0;
          setTimeout(() => {
            this.exportExcel();
          });
        }
        if (res && res.data && res.data.invoice && type == 'grand-collection') {
          this.totalAmount = res.data.sum_of_totals;
          res.data.invoice.forEach((item: any, index: number) => {
              const dateValue = item.date.split('-');
              const params: any = {};
              params.sno = (index + 1);
              params.feedate = item.date ? `${dateValue[0]}-${this.getMonthName(dateValue[1])}-${dateValue[2]} ` : '';
              params.noOfBills = item.no_of_bills;
              params.totalamount = item.total_amount;
              this.printExportData.push(params);
          });
          this.collectionreportLoader = false;
          setTimeout(() => {
            this.exportExcel();
          });
        }
       }
      },
      error: (error: any) => {
        this.collectionreportLoader = false;
      },
      complete: () => {
         this.collectionreportLoader = false;
      }
    });
  }
  getClassNo(list: any, classNo: any): any {
    let val = '';
    list.forEach((item: any) => {
      if (item.name == classNo) {
        val = item.value;
      }
    });
    return val;
  }
  getMonthName(monthNumber: any) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'short' });
  }

  exportExcel() {
    let Heading: any;
    let fileName = '';
    if(this.exportType === 'daily-collection') {
      fileName = 'dailycollectionreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.xlsx';
      this.printExportData.push({billno: '', billdate: '', name: '', 'class': '', totalamount: 'Total Amout (₹): ' + this.totalAmount},)
      Heading = [['Bill-No', 'Bill-Date', 'Name', 'Class', 'Total (₹)']];
    }
    if(this.exportType === 'grand-collection') {
      fileName = 'grandcollectionreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.xlsx';
      this.printExportData.push({sno: '', feedate: '', noOfBills: '', totalamount: 'Total Amout (₹): ' + this.totalAmount})
      Heading = [['S.No', 'Fee-Date', 'Total Invoice' ,'Total (₹)']];
    }
    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, this.printExportData, { origin: 'A2', skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, fileName);
  }

uploadStudentFile(event: any) {
  this.fileError = '';
  this.file = event.target.files[0];
  this.fileName = this.file.name;
  if (this.fileValidationArray.indexOf(this.file.type) === -1) {
    this.fileError = 'Upload only .xls .xlsx Files';
    return;
  }
}
submitUploadFile() {
  if (!this.file) {
    this.fileError = 'Choose file to upload';
    return;
  }
  if (this.fileValidationArray.indexOf(this.file.type) === -1) {
    this.fileError = 'Upload only .xls .xlsx Files';
    return;
  }
  const params: any = {};
  params.file = this.file;
  this.subscriptions['file'] = this.appService.uploadBookList(params).subscribe({
    next: (res: any) => {
      this.file = "";
    },
    error: (error: any) => {
      this.fileError = error?.error?.message;
    },
    complete: () => {}
    });
  this.file = "";
}

ngOnDestroy(): void {
  each(this.subscriptions, (subscription: Subscription) => {
    subscription.unsubscribe();
  });
}

}
