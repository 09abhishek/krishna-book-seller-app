import { Component, OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-grant-total-report',
  templateUrl: './grant-total-report.component.html',
  styleUrls: ['./grant-total-report.component.scss']
})
export class GrantTotalReportComponent implements OnInit {
  loading = false;
  tableData: any = [];
  customers: any = [];
  header = 'amit kumar'
  basicDetails: any = {
    name: 'mahesh kumar',
    Mob_no: 9939099390,
    class: 10,
    bill_no: 123456,
    father_name: 'ramesh kumar',
    bill_date: '21/10/2022',
    Total_amt: 5800
  }
  constructor() { }

  ngOnInit(): void {
    this.tableData = [
      {
        "id": 1000,
        "name": 'James Butt',
        "rate": '12',
        "quantity": '2',
        "amount": '200',
        "country": {
            "name": "Algeria",
            "code": "dz"
        },
        "company": "Benton, John B Jr",
        "date": "2015-09-13",
        "status": "unqualified",
        "activity": 17,
        "representative": {
            "name": "Ioni Bowcher",
            "image": "ionibowcher.png"
        }
    },
    {
        "id": 1001,
        "name": "Josephine Darakjy",
        "rate": '122',
        "quantity": '2',
        "amount": '2002',
        "country": {
            "name": "Egypt",
            "code": "eg"
        },
        "company": "Chanay, Jeffrey A Esq",
        "date": "2019-02-09",
        "status": "proposal",
        "activity": 0,
        "representative": {
            "name": "Amy Elsner",
            "image": "amyelsner.png"
        }
    },
    {
        "id": 1002,
        "name": "Art Venere",
        "rate": '123',
        "quantity": '23',
        "amount": '2003',
        "country": {
            "name": "Panama",
            "code": "pa"
        },
        "company": "Chemel, James L Cpa",
        "date": "2017-05-13",
        "status": "qualified",
        "activity": 63,
        "representative": {
            "name": "Asiya Javayant",
            "image": "asiyajavayant.png"
        }
    },
    ];
    this.customers = [
      {
        "id": 1000,
        "S_no": 1,
        "name": "James Butt",
        "amount": '3000',
        "father_name": "Ramesh kumar",
        "country": {
            "name": "Algeria",
            "code": "dz"
        },
        "company": "Benton, John B Jr",
        "date": "2015-09-13",
        "status": "unqualified",
        "activity": 17,
        "representative": {
            "name": "Ioni Bowcher",
            "image": "ionibowcher.png"
        }
    },
    {
        "id": 1001,
        "S_no": 2,
        "name": "Josephine Darakjy",
        "amount": '4000',
        "father_name": "Ramesh kumar",
        "country": {
            "name": "Egypt",
            "code": "eg"
        },
        "company": "Chanay, Jeffrey A Esq",
        "date": "2019-02-09",
        "status": "proposal",
        "activity": 0,
        "representative": {
            "name": "Amy Elsner",
            "image": "amyelsner.png"
        }
    },
    ];
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
        headerRows: 4,
        widths: [ '*', 'auto', 100, '*'],
        body: this.buildTableBody(data, headerColums, bodyColumns),
      },
    };
  }

  generatePdf() {
    console.log('generatePdf');
    let docDefinition: any = {
      content: [
        { text: 'krishna Book Seller', style: 'topheader' },
        { text: 'Mithanpura, Muzaffarpur-842002', style: 'address' },
        { text: 'invoice', bold: true, style: 'invoice' },
        // basic info details
        {
          style: "basicdetails",
          layout: 'noBorders',
          table: {
            widths: [ '*', 'auto'],
            body: [
              ['Name:' +'  '+ this.basicDetails?.name,                   'Bill No:' +'  '+  this.basicDetails?.bill_no],
              ['Father\'s Name:' +'  '+ this.basicDetails?.father_name,  'Class:' +'  '+ this.basicDetails?.class],
              ['Mobile No:' +'  '+  this.basicDetails?.Mob_no,           'Bill Date:' +'  '+  this.basicDetails?.bill_date],
            ]
          },
        },
        this.table(
          this.tableData,
          //first row
          [
            { text: 'Particulars', bold: true },
            { text: 'Rate', bold: true },
            { text: 'Quantity', bold: true },
            { text: 'Amount', bold: true },
          ],
          // api row find with key text
          [
            { text: 'name', bold: true },
            { text: 'rate', bold: true },
            { text: 'quantity', bold: true },
            { text: 'amount', bold: true },
          ],
        ),
        {text: 'Total Amount Rs:' +'  '+ this.basicDetails?.Total_amt, style: 'totalAmt'},
        {text: 'Authorised Signatory', bold: true, margin: [0, 20, 10, 20], alignment: 'right' },
        {text: 'SP Note.', bold: true, margin: [0, 5, 0, 0], fontSize: 10, },
        {text: '1. Book once distributed will not be exchanged or returned under any circumstances.', fontSize: 10, },
        {text: '2. Bill should be kept very carefully and should not be misplaced under any circumstances.', fontSize: 10, },
        {text: '3. All books must be checked at the counter itself at the time of delivery.No complains will be entertained later on.', fontSize: 10, },
      ],
      styles: {
        topheader: {
          fontSize: 18,
			    alignment: 'center',
          bold: true,
        },
        address: {
          fontSize: 11,
			    alignment: 'center',
        },
        invoice: {
          fontSize: 15,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center',
        },
        basicdetails: {
          margin: [0, 0, 0, 10]
        },
        totalAmt: {
          margin: [0, 10, 10, 20],
          alignment: 'right',
          bold: true,
        }
      },
    };
    const win = window.open('', '_blank');
    pdfMake.createPdf(docDefinition).open({}, win);
  }

}
