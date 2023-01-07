import { classList } from './../../../shared/class-list';
import { ReportService } from './../../report.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import {each, groupBy} from 'lodash';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.scss']
})
export class CollectionReportComponent implements OnInit, OnDestroy {
  loading = false;
  collectionReport: any = [];
  todayDate: any = new Date();
  fromDateValue: any = new Date();
  toDateValue: any = new Date();
  totalAmount: any;
  intialPageLoaded = false;
  printExportData: any = [];
  private subscriptions: any = {};
  classList: any = classList;

  constructor(public reportService: ReportService) { }

  ngOnInit(): void {

  }

  generateReport() {
    this.loading = true;
    const params: any = {};
    params.from = moment(this.fromDateValue).format('YYYY-MM-DD');
    params.to = moment(this.toDateValue).format('YYYY-MM-DD');
    this.subscriptions['getCollection'] = this.reportService.getcollectionReport(params).subscribe({
      next: (res) => {
        this.intialPageLoaded = true;
        this.collectionReport = [];
        this.printExportData = [];
        if (res && res.data && res.data.invoice) {
          res.data.invoice.forEach((item: any) => {
            item['class_no'] = this.getClassNo(this.classList, item.class)
          });
          this.collectionReport = res.data.invoice;
          this.totalAmount = res.data.sum_of_totals;
          res.data.invoice.forEach((item: any) => {
            const params: any = {};
              params.billno = item.id;
              params.billdate = item.date ? moment(item.date).format('DD-MMM-YYYY') : '';
              params.name = item.name;
              params.class = this.getClassNo(this.classList, item.class);
              params.totalamount = item.total_amount;
              this.printExportData.push(params);
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.intialPageLoaded = true;
      },
      complete: () => {
        this.loading = false;
        this.intialPageLoaded = true;
      }
    });
  }
  getBillDate(date: any) {
    return moment(date).format('DD-MM-YYYY');
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

  buildTableBody(data: any, headerColums: any, bodyColumns: any) {
    const body = [];
    body.push(headerColums);
    data.forEach((row : any) => {
      let dataRow: any = [];
      bodyColumns.forEach((column: any) => {
          dataRow.push(row[column.text]);
      });
      body.push(dataRow);
    });
    return body;
  }

  table(data: any, headerColums: any, bodyColumns: any): any {
    return {
      table: {
        headerRows: 1,
        widths: [ '*', '*', '*', '*', '*'],
        body: this.buildTableBody(data, headerColums, bodyColumns),
      },
    };
  }

  generatePdf(type: string) {
    console.log('generatePdf');
    let docDefinition: any = {
      content: [
        { text: 'Krishna Book Seller', style: 'topheader' },
        { text: 'Ramna, Muzaffarpur-842002', style: 'address' },
        { text: 'Daily Collection Report', bold: true, style: 'invoice' },
        {
          style: "dateTable",
          layout: 'noBorders',
          table: {
            widths: [ '*', '*'],
            body: [
              [{ text: `Date ${(this.fromDateValue ? moment(this.fromDateValue).format('DD-MMM-YYYY') : '')} To ${(this.toDateValue ? moment(this.toDateValue).format('DD-MMM-YYYY') : '')}`}, {text: `Print Date ${(moment(this.todayDate).format('DD-MMM-YYYY'))}`, alignment: 'right' }],
            ]
          },
        },
        this.table(
          this.printExportData,
          //first row
          [
            { text: 'Bill-No', bold: true },
            { text: 'Bill-Date', bold: true },
            { text: 'Name', bold: true },
            { text: 'Class', bold: true },
            { text: 'Total (₹)', bold: true },
          ],
          // api row find with key text
          [
            { text: 'billno', bold: true },
            { text: 'billdate', bold: true },
            { text: 'name', bold: true },
            { text: 'class', bold: true },
            { text: 'totalamount', bold: true },
          ],
        ),
        {text: 'Grand Total (₹): ' + this.totalAmount, style: 'totalAmt'},
      ],
      styles: {
        topheader: {
          fontSize: 15,
			    alignment: 'center',
          bold: true,
        },
        address: {
          fontSize: 10,
			    alignment: 'center',
        },
        invoice: {
          fontSize: 13,
          bold: true,
          margin: [0, 15, 0, 5],
          alignment: 'center',
        },
        totalAmt: {
          margin: [0, 10, 10, 20],
          alignment: 'right',
          bold: true,
        },
        peroidDate: {
          margin: [0, 5, 0, 8],
        },
        dateTable: {
          margin: [0, 5, 0, 8],
        }
      },
    };
    const win = window.open('', '_blank');
    const download = window.open('', '_self');
    if(type == 'print') {
      pdfMake.createPdf(docDefinition).print({}, win);
    } else {
      const fileName = 'dailycollectionreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.pdf';
      pdfMake.createPdf(docDefinition).download(fileName);
    }
  }

  exportExcel() {
      let exportData = [];
      exportData = JSON.parse(JSON.stringify(this.printExportData));
      const fileName = 'dailycollectionreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.xlsx';
      exportData.push({billno: '', billdate: '', name: '', 'class': '', totalamount: 'Total Amout (₹): ' + this.totalAmount},)
      let Heading = [['Bill-No', 'Bill-Date', 'Name', 'Class', 'Total (₹)']];
      //Had to create a new workbook and then add the header
      const wb = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(ws, Heading);

      //Starting in the second row to avoid overriding and skipping headers
      XLSX.utils.sheet_add_json(ws, exportData, { origin: 'A2', skipHeader: true });

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, fileName);
    }
  ngOnDestroy(): void {
    each(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
