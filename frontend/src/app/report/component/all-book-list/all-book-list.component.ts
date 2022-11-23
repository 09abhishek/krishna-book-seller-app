import { Component, OnInit } from '@angular/core';
import {each, groupBy} from 'lodash';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-all-book-list',
  templateUrl: './all-book-list.component.html',
  styleUrls: ['./all-book-list.component.scss']
})
export class AllBookListComponent implements OnInit {

  printExportData: any = [];
  allBookList: any = [];
  todayDate: any = new Date();
  loading = true;
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

  constructor(public reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getBookReportList().subscribe({
      next: (res) => {
        this.loading = false;
        this.allBookList = [];
        if (res && res.data) {
          res.data.forEach((item: any) => {
            item['class_no'] = this.getClassNo(this.classList, item.class);
          });
          this.allBookList = res.data;
          res.data.forEach((item: any, index: number) => {
              const params: any = {};
              params.name = item.name;
              params.Publication = item.publication.name;
              params.quantity = item.quantity;
              params.net_price = item.net_price;
              params.mrp = item.mrp;
              params.class = this.getClassNo(this.classList, item.class);
              this.printExportData.push(params);
          });
        }
      },
      error: (error) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
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
    return +val;
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
        widths: [ 'auto', '*', '*', '*', '*', '*'],
        body: this.buildTableBody(data, headerColums, bodyColumns),
      },
    };
  }

  generatePdf(type: string) {
    let docDefinition: any = {
      content: [
        { text: 'Krishna Book Seller', style: 'topheader' },
        { text: 'Ramana, Muzaffarpur-842002', style: 'address' },
        { text: 'Book Report', bold: true, style: 'invoice' },
        { text: 'Print Date:  ' + (this.todayDate ? moment(this.todayDate).format('DD-MM-YYYY') : '') , bold: true, style: 'peroidDate', alignment: 'left'},

        this.table(
          this.printExportData,
          //first row
          [
            { text: 'Book Name', bold: true },
            { text: 'Publication', bold: true },
            { text: 'Quantity', bold: true },
            { text: 'Net Price(₹)', bold: true },
            { text: 'MRP(₹)', bold: true },
            { text: 'Class', bold: true },
          ],
          // api row find with key text
          [
            { text: 'name', bold: true },
            { text: 'Publication', bold: true },
            { text: 'quantity', bold: true },
            { text: 'net_price', bold: true },
            { text: 'mrp', bold: true },
            { text: 'class', bold: true },
          ],
        ),
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
      const fileName = 'bookreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.pdf';
      pdfMake.createPdf(docDefinition).download(fileName);
    }
  }

  exportExcel() {
      const fileName = 'bookreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.xlsx';
      let Heading = [['Book Name', 'Publication', 'Quantity', 'Net Price(₹)', 'MRP(₹)', 'Class']];
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
