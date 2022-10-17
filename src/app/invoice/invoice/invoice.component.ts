import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, AfterContentChecked {
  public invoiceForm: any;
  invoiceData: any = []
  selectedBook: any = [];
  selectedBookIds: any = [];
  totalInvoiceAmount: any = '';
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm();
    this.invoiceData = [
      {
        id: 123,
        Particulars: 'CSS Mastery',
        rate: '',
        qty: '',
        amount: ''
      },
      {
        id: 124,
        Particulars: 'CSS Pocket Reference: Visual Presentation for the Web',
        rate: '',
        qty: '',
        amount: ''
      },
      {
        id: 125,
        Particulars: 'CSS in Depth',
        rate: '',
        qty: '',
        amount: ''
      }
    ]
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
}
  public initForm(): void {
    this.invoiceForm = this.fb.group({
      name: [''],
      billno: [''],
      fathername: [''],
      mobno: [''],
      classno: [''],
      date: [''],
      address: ['']
    });
  }
  onsave() {
    console.log(this.invoiceForm.value);
    console.log(this.selectedBook);
    console.log(this.invoiceData);
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
    if (rate && qty) {
      const rateVal = parseFloat(rate);
      const amt: any = (rateVal*qty).toFixed(2);
      this.invoiceData.forEach((item: any)=> {
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
  changeTotal(event: any, data: any) {
    console.log(event);
    this.invoiceData.forEach((item: any)=> {
      if(item.id === data.id) {
        console.log('inside', item)
        item.amount = event;
      }
    });
  }
  totalAmount(): any {
    let total: any = '';
    let intialSum: any = 0;
    if(this.selectedBook.length > 0) {
      this.selectedBook.forEach((item: any) => {
        if (item.rate && item.qty && item.amount) {
          const amt = parseFloat(item.amount);
          intialSum = intialSum + amt
        }
      });
      this.totalInvoiceAmount = parseFloat(intialSum).toFixed(2);
      // this.cdr.detectChanges();
    } else {
      this.totalInvoiceAmount = '';
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
}
