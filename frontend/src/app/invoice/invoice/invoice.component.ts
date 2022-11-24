import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { InvoiceService } from '../invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {each, groupBy} from 'lodash';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { InvoicePrintService } from './invoice-print.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, AfterContentChecked, OnDestroy {

  public invoiceForm: any;
  bookList: any = [];
  classId: any;
  selectedBook: any = [];
  selectedBookIds: any = [];
  totalInvoiceAmount: any = '';
  netInvoiceAmount: any = '';
  submitLoader = false;
  intialPageLoader = false;
  showPrint = false;
  billingDate: any = new Date();
  private sub: any;
  private subscriptions: any = {};
  printData: any;
  invoiceId: any;
  invoiceDetails: any;
  selectedBookListByid: any = {};
  previousClassId: any;
  previousSelectedBook: any = [];
  errorMessage: any = '';
  saveInvoiceId: any;
  classList: any = [
    {id: 1, name: 'pre-nursery', value: 'Pre Nursery'},
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
  constructor(
     private fb: FormBuilder,
     private cdr: ChangeDetectorRef,
     private confirmationDialogService: ConfirmationDialogService,
     private invoiceService: InvoiceService,
     private route: ActivatedRoute,
     private invoicePrintService: InvoicePrintService,
     private messageService: MessageService) { }

  ngOnInit(): void {
    this.initForm();
    this.getRouteParams();
  }
  getRouteParams() {
    this.sub = this.route.params.subscribe(params => {
        console.log('params', params);
        this.invoiceId = '';
        if (params && params['id']) {
            this.invoiceId = params['id'];
            this.intialPageLoader = true;
            this.getInvoiceDetails(this.invoiceId);
        } else {
          this.getInvoiceNumber();
        }
    });
  }
  getInvoiceNumber() {
    this.subscriptions['getInvoiceNumber'] = this.invoiceService.getInvoiceNo({}).subscribe((item: any) => {
      if(item && item.data) {
        this.invoiceForm.controls['billno'].setValue(item.data[0]);
      }
    });
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
}
  public initForm(): void {
    this.invoiceForm = this.fb.group({
      name: ['', [Validators.required]],
      billno: [''],
      fathername: ['', [Validators.required]],
      mobno: [''],
      classno: ['', [Validators.required]],
      date: ['', [Validators.required]],
      address: ['']
    });
    this.invoiceForm.controls['billno'].disable();
    this.invoiceForm.controls['date'].disable();
  }
  onSaveConfirmation() {
    if (!this.invoiceForm.valid) {
      this.validateAllFormFields(this.invoiceForm);
      return;
    }
    if (this.selectedBook.length === 0) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'atLeast Select one book'});
      return;
    }
    this.openConfirmationDialog();
  }
  SaveInvoice() {
    this.errorMessage = '';
    const formValue = this.invoiceForm.getRawValue();
    const params: any = {};
    let billParticulars: any = [];
    this.selectedBook.forEach((item: any) => {
      if (item.quantity && item.amount) {
          const param: any = {};
          param.id = item.id;
          param.name = item.name;
          param.amount = item.amount;
          param.class = item.class;
          param.year = item.year;
          param.publication_id = item.publication_id;
          param.mrp = item.mrp;
          param.net_price = item.net_price;
          param.quantity = item.quantity ? Number(item.quantity) : '';
          billParticulars.push(param);
      }
    });
    this.submitLoader = true;
    params.name = formValue.name;
    params.stdClass = formValue.classno;
    params.fatherName = formValue.fathername;
    params.totalAmount = this.totalInvoiceAmount;
    params.totalNetAmount = this.netInvoiceAmount;
    if(formValue.mobno) {
      params.mobileNum = formValue.mobno;
    }
    if(formValue.address) {
      params.address = formValue.address;
    }
    params.billParticulars = billParticulars;
    if(this.invoiceId) {
      params.invoiceId = this.invoiceId ? this.invoiceId : '';
      params.previousBillParticulars = this.previousSelectedBook;
    }
    this.printData = {};
    this.subscriptions['saveInvoice'] = this.invoiceService.saveInvoice(params).subscribe({
      next: (res) => {
        if(res && res.message) {
          if(!this.invoiceId && res.data && res.data[0]) {
            this.saveInvoiceId = res.data[0];
          }
          // this.messageService.add({severity:'success', summary: 'Success', detail: "SuccessFully Created"});
          this.submitLoader = false;
          this.showPrint = true;
          this.printData = params;
          this.printData['bill_no'] =  formValue.billno ? formValue.billno : '';
          // this.cancel();
        }
      },
      error: (error)=> {
        console.log('error', error.error);
        this.errorMessage = error?.error?.message;
        this.submitLoader = false;
      }
    });
  }

  cancel() {
      this.selectedBook = [];
      this.selectedBookIds = [];
      this.totalInvoiceAmount = '';
      this.netInvoiceAmount = '';
      this.showPrint = false;
    if(this.invoiceId) {
      this.getInvoiceDetails(this.invoiceId);
    } else {
      this.invoiceForm.controls['name'].reset();
      this.invoiceForm.controls['fathername'].reset();
      this.invoiceForm.controls['mobno'].reset();
      this.invoiceForm.controls['address'].reset();
      this.invoiceForm.controls['classno'].reset();
      this.classId = '';
      this.getInvoiceNumber();
    }
  }
  resetparticularField() {
    this.bookList.forEach((item: any) => {
      if(this.selectedBookIds.indexOf(item.id) > -1) {
         item.quantity = '1';
         item.amount = '';
      }
    })
  }
  onChangeClass(val: any) {
    this.intialPageLoader = true;
    this.classId = val.value;
    this.errorMessage = '';
    this.subscriptions['bookList'] = this.invoiceService.getBookList(this.classId)
    .subscribe((item: any) => {
      this.intialPageLoader = false;
      this.bookList = [];
      this.selectedBookIds = [];
      this.selectedBook = [];
      if(item && item.data) {
        item.data.forEach((data: any) => {
          data['quantity'] = '1';
          data['amount'] = '';
          this.selectedBookIds.push(data.id)
        })
        this.bookList = item.data;
        this.selectedBook = item.data;
      }
    });

    this.resetparticularField();
    setTimeout(()=> {
      this.selectedBook = [];
      this.selectedBookIds = [];
      this.totalInvoiceAmount = '';
      this.netInvoiceAmount = '';
      this.showPrint = false;
    }, 10);
  }
  onSelectBook(event: any, data: any) {
    const idx = this.selectedBookIds.indexOf(data.id);
     if(idx > -1) {
      this.selectedBook = this.selectedBook.filter((item: any) => item.id !== data.id);
      this.selectedBookIds.splice(idx, 1);
     } else {
      this.selectedBook.push(data);
      this.selectedBookIds.push(data.id);
     }
  }
  calculatedAmount(rate: any, qty: number, data: any): any {
    if(this.invoiceId && rate && qty && this.selectedBook.length > 0) {
      this.selectedBook.forEach((_item: any) => {
        if (_item.id === data.id) {
          _item['quantity'] = qty;
          _item['amount'] = (Number(qty) * parseFloat(_item.mrp)).toFixed(2);
        }
      });
    }
    if (rate && qty) {
      const rateVal = parseFloat(rate);
      const amt: any = (rateVal*qty).toFixed(2);
      this.bookList.forEach((item: any)=> {
        if(item.id === data.id) {
          item.amount = amt;
        }
      });
      this.totalAmount();
      return amt;
    } else {
      return '';
    }
  }
  totalAmount(): any {
    let total: any = '';
    let intialSum: any = 0;
    let intialNetQtySum: any = 0;
    if(this.selectedBook.length > 0) {
      this.selectedBook.forEach((item: any) => {
        if (item.mrp && item.quantity && item.amount) {
          const amt = parseFloat(item.amount);
          intialSum = intialSum + amt;

          const netPriceAmt = (parseFloat(item.net_price) * Number(item.quantity));
          intialNetQtySum = intialNetQtySum + netPriceAmt;
        }
      });
      this.totalInvoiceAmount = parseFloat(intialSum).toFixed(2);
      this.netInvoiceAmount = parseFloat(intialNetQtySum).toFixed(2);
      // this.cdr.detectChanges();
    } else {
      this.totalInvoiceAmount = '';
      this.netInvoiceAmount = '';
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Confirmation', `Are you sure you want to ${this.invoiceId ? 'Update' : 'Save'} Invoice!`,
        "Okay", "Cancel","primary", "secondary")
        .then((confirmed) => {
            console.log('User confirmed:', confirmed);
            if (confirmed) {
              this.SaveInvoice();
            }
      })
       .catch(() => {
       console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
    });
  }
  getInvoiceDetails(id: any) {
    this.selectedBookIds = [];
    this.selectedBook = [];
    this.previousClassId = '';
    this.previousSelectedBook = [];
    this.subscriptions['invoiceDetails'] = this.invoiceService.getInvoiceDetails(id)
    .subscribe((item: any) => {
      if(item && item.data && item.data.length > 0) {
        this.invoiceDetails = item.data[0];
        this.selectedBookListByid = groupBy(this.invoiceDetails.bill_data, 'id');
        this.getBookList(this.invoiceDetails.class);
        this.classId = this.invoiceDetails.class;
        this.previousClassId = this.invoiceDetails.class;
        this.invoiceForm.controls['name'].setValue(this.invoiceDetails.name);
        this.invoiceForm.controls['billno'].setValue(this.invoiceDetails.id);
        this.invoiceForm.controls['fathername'].setValue(this.invoiceDetails.father_name);
        this.invoiceForm.controls['mobno'].setValue(this.invoiceDetails.mobile_num);
        this.invoiceForm.controls['classno'].setValue(this.invoiceDetails.class);
        // this.invoiceForm.controls['date'].setValue(this.invoiceDetails.date);
        this.invoiceForm.controls['address'].setValue(this.invoiceDetails.address);
        // this.totalInvoiceAmount = this.invoiceDetails.total_amount;
        // this.netInvoiceAmount = this.invoiceDetails.totalNetAmount;
        this.billingDate = new Date(this.invoiceDetails.date);
        if (this.invoiceDetails && this.invoiceDetails.bill_data) {
          this.invoiceDetails.bill_data.forEach((data: any) => {
            this.selectedBookIds.push(data.id);
            this.selectedBook.push({id: data.id, name: data.name, amount: data.amount, class: data.class, year: data.year, publication_id: data.publication_id, net_price: data.net_price, quantity: data.quantity, mrp: data.mrp});
            this.previousSelectedBook.push({id: data.id, quantity: data.quantity});
          })
        }
        // console.log('this.selectedBookListByid', this.selectedBookListByid)
      }
    });
  }

  getBookList(id: any) {
    this.subscriptions['bookListdata'] = this.invoiceService.getBookList(id)
    .subscribe((item: any) => {
      this.intialPageLoader = false;
      if(item && item.data) {
        item.data.forEach((data: any) => {
            data['quantity'] = '1';
          if (this.selectedBookListByid && this.selectedBookListByid[data.id]) {
            data['quantity'] = this.selectedBookListByid[data.id].length > 0 ? this.selectedBookListByid[data.id][0].quantity : '1';
            data['amount'] = this.selectedBookListByid[data.id].length > 0 ? this.selectedBookListByid[data.id][0].amount : '';
          }
        });
        this.bookList = item.data;
      }
    });
  }
  printInvoice(type: string) {
    // this.invoicePrintService.generatePdf(this.printData, this.billingDate, this.classList, type);
    const id = this.invoiceId ? this.invoiceId : this.saveInvoiceId;
    this.generatePdf(type, id);
  }
  generatePdf(type: string, id: any) {
    this.invoiceDetails = [];
    let printData: any = {};
    this.invoiceService.getInvoiceDetails(id)
    .subscribe((item: any) => {
      if(item && item.data && item.data.length > 0) {
        this.invoiceDetails = item.data[0];
        const params: any = {};
        const billParticulars: any = [];
        params.name = (this.invoiceDetails && this.invoiceDetails.name) ? this.invoiceDetails.name.toUpperCase() : '';
        params.stdClass = this.invoiceDetails.class;
        params.fatherName = (this.invoiceDetails && this.invoiceDetails.father_name) ? this.invoiceDetails.father_name.toUpperCase() : '';
        params.totalAmount = this.invoiceDetails.total_amount;
        params.address = (this.invoiceDetails && this.invoiceDetails.address) ? this.invoiceDetails.address.toUpperCase() : '';
        params.bill_no = this.invoiceDetails.id;
        params.mobileNum = this.invoiceDetails.mobile_num ? this.invoiceDetails.mobile_num : '';
        this.invoiceDetails?.bill_data.forEach((item: any) => {
          const param: any = {};
          param.id = item.id;
          param.name = item.name;
          param.amount = item.amount;
          param.class = item.class;
          param.year = item.year;
          param.publication_id = item.publication_id;
          param.mrp = item.mrp;
          param.net_price = item.net_price;
          param.quantity = item.quantity ? Number(item.quantity) : '';
          billParticulars.push(param);
        });
        params.billParticulars = billParticulars;
        printData = params;
        this.invoicePrintService.generatePdf(printData, this.billingDate, this.classList, type);
      }
    });
}
  ngOnDestroy(): void {
    // this.sub.unsubscribe();
    each(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
