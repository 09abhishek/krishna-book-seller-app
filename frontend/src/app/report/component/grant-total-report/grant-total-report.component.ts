import { ReportService } from './../../report.service';
import { Component, OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-grant-total-report',
  templateUrl: './grant-total-report.component.html',
  styleUrls: ['./grant-total-report.component.scss']
})
export class GrantTotalReportComponent implements OnInit {
  loading = false;
  intialPageLoaded = false;
  tableData: any = [];
  customers: any = [];
  todayDate: any = new Date();
  fromDateValue: any = new Date();
  toDateValue: any = new Date();
  grandCollectionReport: any = [];
  printExportData: any = [];
  totalAmount: any;

  constructor(public reportService: ReportService) { }

  ngOnInit(): void {

  }
  generateReport() {
    this.loading = true;
    const params: any = {};
    params.from = moment(this.fromDateValue).format('YYYY-MM-DD');
    params.to = moment(this.toDateValue).format('YYYY-MM-DD');
    this.reportService.getGrandcollectionReport(params).subscribe({
      next: (res) => {
        this.intialPageLoaded = true;
        if (res && res.data) {
          this.grandCollectionReport = res.data.invoice;
          this.totalAmount = res.data.sum_of_totals;
          res.data.invoice.forEach((item: any, index: number) => {
              const params: any = {};
              params.sno = (index + 1);
              params.feedate = item.date ? moment(item.date).format('DD-MMM-YYYY') : '';
              params.name = item.name;
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
        widths: [ '*', '*', '*'],
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
        { text: 'Grand Total Report', bold: true, style: 'invoice' },
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
            { text: 'S.No', bold: true },
            { text: 'Fee-Date', bold: true },
            { text: 'Total (₹)', bold: true },
          ],
          // api row find with key text
          [
            { text: 'sno', bold: true },
            { text: 'feedate', bold: true },
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
      const fileName = 'grandcollectionreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.pdf';
      pdfMake.createPdf(docDefinition).download(fileName);
    }
  }

  exportExcel() {
      const fileName = 'grandcollectionreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.xlsx';
      this.printExportData.push({sno: '', feedate: '', totalamount: 'Total Amout (₹): ' + this.totalAmount})
      let Heading = [['S.No', 'Fee-Date','Total (₹)']];
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
