import { Component, OnInit } from '@angular/core';
import {each, groupBy} from 'lodash';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-publication-report',
  templateUrl: './publication-report.component.html',
  styleUrls: ['./publication-report.component.scss']
})
export class PublicationReportComponent implements OnInit {

  printExportData: any = [];
  publicationList: any = [];
  todayDate: any = new Date();
  loading = true;
  constructor(public reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getPublicationReportList().subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.data) {
          this.publicationList = res.data;
          res.data.forEach((item: any, index: number) => {
              const params: any = {};
              params.sno = index + 1;
              params.name = item.name;
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
        widths: [ '*', '*'],
        body: this.buildTableBody(data, headerColums, bodyColumns),
      },
    };
  }

  generatePdf(type: string) {
    let docDefinition: any = {
      content: [
        { text: 'Krishna Book Seller', style: 'topheader' },
        { text: 'Mithanpura, Muzaffarpur-842002', style: 'address' },
        { text: 'Book Stock Report', bold: true, style: 'invoice' },
        { text: 'Print Date:  ' + (this.todayDate ? moment(this.todayDate).format('DD-MM-YYYY') : '') , bold: true, style: 'peroidDate', alignment: 'left'},
        this.table(
          this.printExportData,
          //first row
          [
            { text: 'S No.', bold: true },
            { text: 'Publication Name', bold: true },
          ],
          // api row find with key text
          [
            { text: 'sno', bold: true },
            { text: 'name', bold: true },
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
      const fileName = 'publicationreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.pdf';
      pdfMake.createPdf(docDefinition).download(fileName);
    }
  }

  exportExcel() {
      const fileName = 'publicationreport ' + moment(this.todayDate).format('DD-MMM-YYYY') + '.xlsx';
      let Heading = [['S No', 'Publication Name']];
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
