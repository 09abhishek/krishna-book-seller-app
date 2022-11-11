import { ReportService } from './../../report.service';
import { Component, OnInit } from '@angular/core';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.scss']
})
export class CollectionReportComponent implements OnInit {
  loading = false;
  collectionReport: any = [];
  todayDate: any = new Date();
  fromDateValue: any = new Date();
  toDateValue: any = new Date();
  totalAmount: any;
  intialPageLoaded = false;
  printExportData: any = [];
  classList: any = [
    {id: 1, name: 'infant', value: 'infant'},
    {id: 2, name: 'nursery', value: 'nursery'},
    {id: 3, name: 'prep', value: 'prep'},
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

  constructor(public reportService: ReportService) { }

  ngOnInit(): void {

  }

  generateReport() {
    this.loading = true;
    const params: any = {};
    params.from = moment(this.fromDateValue).format('YYYY-MM-DD');
    params.to = moment(this.toDateValue).format('YYYY-MM-DD');
    this.reportService.getcollectionReport(params).subscribe({
      next: (res) => {
        this.intialPageLoaded = true;
        if (res && res.data) {
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
        // if (column.text == 'Particulars' || column.text == 'Rate'|| column.text == 'Quantity'|| column.text == 'Amount') {
          dataRow.push(row[column.text]);
        // }
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
        { text: 'Mithanpura, Muzaffarpur-842002', style: 'address' },
        { text: 'Daily Collection Report', bold: true, style: 'invoice' },
        { text: 'Date:  ' + (this.fromDateValue ? moment(this.fromDateValue).format('DD-MMM-YYYY') : '') + ' To  '+ (this.toDateValue ? moment(this.toDateValue).format('DD-MMM-YYYY') : '') , bold: true, style: 'peroidDate', alignment: 'left'},

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
      const fileName = 'dailycollectionreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.xlsx';
      this.printExportData.push({billno: '', billdate: '', name: '', 'class': '', totalamount: 'Total Amout (₹): ' + this.totalAmount},)
      let Heading = [['Bill-No', 'Bill-Date', 'Name', 'Class', 'Total (₹)']];
      //Had to create a new workbook and then add the header
      const wb = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(ws, Heading);

      //Starting in the second row to avoid overriding and skipping headers
      XLSX.utils.sheet_add_json(ws, this.printExportData, { origin: 'A2', skipHeader: true });

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, fileName);
    }
}
