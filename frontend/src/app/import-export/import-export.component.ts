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
  classList: any = [
    {id: 1, name: 'prenursery', value: 'Pre Nursery'},
    {id: 2, name: 'nursery', value: 'Nursery'},
    {id: 1, name: 'infant', value: 'Infant'},
    {id: 3, name: 'prep', value: 'Preparatory'},
    {id: 4, name: 'one', value: '1'},
    {id: 5, name: 'two', value: '2'},
    {id: 6, name: 'three', value: '3'},
    {id: 7, name: 'four', value: '4'},
    {id: 8, name: 'five', value: '5'},
    {id: 9, name: 'six', value: '6'},
    {id: 10, name: 'seven', value: '7'},
    {id: 11, name: 'eight', value: '8'},
    {id: 12, name: 'nine', value: '9'},
    {id: 13, name: 'ten', value: '10'},
    {id: 14, name: 'eleven', value: '11'},
    {id: 14, name: 'twelve', value: '12'},
  ];
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
      next: (res) => {
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
          for(let i = 0; i < 3000; i++) {
            const params: any = {};
              params.sno = 1;
              params.feedate = '22/04/2022';
              params.noOfBills = '4';
              params.totalamount = '4000';
              this.printExportData.push(params);
          }
          this.collectionreportLoader = false;
          setTimeout(() => {
            this.exportExcel();
          });
        }
       }
      },
      error: (error) => {
        this.collectionreportLoader = false;
      },
      complete: () => {
        // this.collectionreportLoader = false;
        // this.exportType = '';
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
  // console.log('this.file', this.file);
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
    next: (res) => {
      // console.log('res', res);
    },
    error: (error) => {},
    complete: () => {}
    });
}

ngOnDestroy(): void {
  // this.sub.unsubscribe();
  each(this.subscriptions, (subscription: Subscription) => {
    subscription.unsubscribe();
  });
}

}
