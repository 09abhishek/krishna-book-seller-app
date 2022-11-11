import { Injectable } from "@angular/core";
import {each, groupBy} from 'lodash';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';

@Injectable()
export class InvoicePrintService {

  buildTableBody(data: any, headerColums: any, bodyColumns: any) {
    const body: any = [];
    body.push(headerColums);
    data.forEach((row : any) => {
      let dataRow: any = [];
      bodyColumns.forEach((column: any) => {
        // if (column.text == 'Particulars' || column.text == 'Rate'|| column.text == 'Quantity'|| column.text == 'Amount') {
          dataRow.push(row[column.text]);
        // }
      });
      body.push(dataRow);
      console.log('body', body);
    });
    return body;
  }

  leftTable(data: any, headerColums: any, bodyColumns: any): any {
    console.log('buildTableBody', this.buildTableBody(data, headerColums, bodyColumns))
    return {
      style: "tableDataDetails",
      table: {
        // headerRows: 4,
        widths: [ 'auto', '*', '*', '*'],
        body: this.buildTableBody(data, headerColums, bodyColumns),
      },
    };
  }
  rightTable(data: any, headerColums: any, bodyColumns: any): any {
    return {
      style: "tableDataDetailsright",
      table: {
        // headerRows: 4,
        widths: [ 'auto', '*', '*', '*'],
        body: this.buildTableBody(data, headerColums, bodyColumns),
      },
    };
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
  generatePdf(printData: any, billDate: any, classList: any) {
    console.log('generatePdf');
    let docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        {
          style: "maintableStyle",
          layout: 'noBorders',
          table: {
            widths: [ '*', '*'],
            body: [
              [{ text: 'Krishna Book Seller', style: 'topheader', alignment: 'center'}, { text: 'Krishna Book Seller', style: 'topheader', alignment: 'center'}],
              [{ text: 'Mithanpura, Muzaffarpur-842002', style: 'address',alignment: 'center'},  { text: 'Mithanpura, Muzaffarpur-842002', style: 'address', alignment: 'center'}],
              [{ text: 'Receipt', bold: true, style: 'invoice',alignment: 'center' }, { text: 'Receipt', bold: true, style: 'invoice', alignment: 'center' }],
              [{
                style: "basicdetails",
                layout: 'noBorders',
                table: {
                  widths: [ '*', 'auto'],
                  body: [
                    ['Name:' +'  '+ (printData?.name ? printData?.name : ''),                   'Bill No:' +'  '+  (printData?.bill_no ? printData?.bill_no : '')],
                    ['Father\'s Name:' +'  '+ (printData?.fatherName ? printData?.fatherName : ''),  'Class:' +'  '+ (printData?.stdClass ? this.getClassNo(classList , printData?.stdClass) : '')],
                    ['Mobile No:' +'  '+  (printData?.mobileNum ? printData?.mobileNum : ''),           'Bill Date:' +'  '+  moment(billDate).format('DD-MM-YYYY')],
                    ['Address:' +'  '+  (printData?.address ? printData?.address : ''),            ''],
                  ]
                },
              },
              {
                style: "basicdetailsright",
                layout: 'noBorders',
                table: {
                  widths: [ '*', 'auto'],
                  body: [
                    ['Name:' +'  '+ (printData?.name ? printData?.name : ''),                   'Bill No:' +'  '+  (printData?.bill_no ? printData?.bill_no : '')],
                    ['Father\'s Name:' +'  '+ (printData?.fatherName ? printData?.fatherName : ''),  'Class:' +'  '+ (printData?.stdClass ? this.getClassNo(classList , printData?.stdClass) : '')],
                    ['Mobile No:' +'  '+  (printData?.mobileNum ? printData?.mobileNum : ''),           'Bill Date:' +'  '+  moment(billDate).format('DD-MM-YYYY')],
                    ['Address:' +'  '+  (printData?.address ? printData?.address : ''),            ''],
                  ]
                },
              }],

              [
                this.leftTable(
                  printData.billParticulars,
                  //first row
                  [
                    { text: 'Particulars', bold: true },
                    { text: 'Rate', bold: true },
                    { text: 'Quantity', bold: true },
                    { text: 'Amount (₹)', bold: true },
                  ],
                  // api row find with key text
                  [
                    { text: 'name', bold: true },
                    { text: 'rate', bold: true },
                    { text: 'qty', bold: true },
                    { text: 'price', bold: true },
                  ],
                ),
                this.rightTable(
                  printData.billParticulars,
                  //first row
                  [
                    { text: 'Particulars', bold: true },
                    { text: 'Rate', bold: true },
                    { text: 'Quantity', bold: true },
                    { text: 'Amount (₹)', bold: true },
                  ],
                  // api row find with key text
                  [
                    { text: 'name', bold: true },
                    { text: 'rate', bold: true },
                    { text: 'qty', bold: true },
                    { text: 'price', bold: true },
                  ],
                ),
              ],
              [{text: 'Total Amount (₹):' +'  '+ (printData?.totalAmount ? printData?.totalAmount : ''), style: 'totalAmt'},{text: 'Total Amount (₹):' +'  '+ (printData?.totalAmount ? printData?.totalAmount : ''), style: 'totalAmt'}],
              [{text: 'Authorised Signatory', bold: true, margin: [0, 5, 25, 10], alignment: 'right', fontSize: 10, },{text: 'Authorised Signatory', bold: true, margin: [0, 5, 25, 10], alignment: 'right', fontSize: 10, }],
              [{text: 'SP Note.', bold: true, margin: [0, 5, 15, 0], fontSize: 8, },{text: 'SP Note.', bold: true, margin: [15, 3, 0, 0], fontSize: 8, }],
              [{text: '1. Book once distributed will not be exchanged or returned under any circumstances.',style: 'spnoteDetails'},{text: '1. Book once distributed will not be exchanged or returned under any circumstances.',style: 'spnoteDetailsright'}],
              [{text: '2. Bill should be kept very carefully and should not be misplaced under any circumstances.',style: 'spnoteDetails'},{text: '2. Bill should be kept very carefully and should not be misplaced under any circumstances.',style: 'spnoteDetailsright'}],
              [{text: '3. All books must be checked at the counter itself at the time of delivery.No complains will be entertained later on.', fontSize: 7,style: 'spnoteDetails' },{text: '3. All books must be checked at the counter itself at the time of delivery.No complains will be entertained later on.',style: 'spnoteDetailsright'}]
            ]
          },
        },
      ],
      styles: {
        topheader: {
          fontSize: 12,
          alignment: 'center',
          bold: true,
          margin: [0, 0, 0, 0],
          screenLeft: 100
        },
        address: {
          fontSize: 8,
          alignment: 'center',
        },
        invoice: {
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 4],
          alignment: 'center',
        },
        basicdetails: {
          margin: [0, 0, 15, 10],
          fontSize: 9,
        },
        basicdetailsright: {
          margin: [15, 0, 0, 10],
          fontSize: 9,
        },
        maintableStyle: {
          margin: [0, 0, 0, 10],
          fontSize: 9,
        },
        totalAmt: {
          margin: [0, 0, 25, 8],
          alignment: 'right',
          bold: true,
          fontSize: 10,
        },
        tableDataDetails: {
          fontSize: 8,
          margin: [0, 0, 15, 10],
        },
        tableDataDetailsright: {
          fontSize: 8,
          margin: [15, 0, 0, 10],
        },
        spnoteDetails: {
          fontSize: 7,
          margin: [0, 0, 15, 0],
        },
        spnoteDetailsright: {
          fontSize: 7,
          margin: [15, 0, 0, 0],
        }
      },
    };
    const win = window.open('', '_blank');
    pdfMake.createPdf(docDefinition).print({}, win);
  }
}
