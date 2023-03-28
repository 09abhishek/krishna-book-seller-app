import { classList } from './../../shared/class-list';
import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { InvoiceService } from '../invoice.service';
import { InvoicePrintService } from '../invoice/invoice-print.service';

@Component({
  selector: 'app-search-invoice',
  templateUrl: './search-invoice.component.html',
  styleUrls: ['./search-invoice.component.scss']
})
export class SearchInvoiceComponent implements OnInit {
  invoiceList: any = [];
  loading = false;
  billLoading = false;
  dateLoading = false;
  searchInvoice = false;
  deleteLoader = false;
  todayDate: any = new Date();
  fromDateValue: any = new Date();
  toDateValue: any = new Date();
  billId: any = '';
  billingDate: any = new Date();
  invoiceDetails: any;
  searchBy: any = 'bill-num';
  classList: any = classList;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private invoicePrintService: InvoicePrintService,
    private invoiceService: InvoiceService) { }

  ngOnInit(): void {

  }
  onSearch() {
    // if (!this.fromDateValue || !this.toDateValue) {
    //   this.messageService.add({severity:'error', summary: 'Error', detail: 'Please Select Date'});
    //   return;
    // }
    this.loading = true;
    const params: any = {};
    params.from = moment(this.fromDateValue).format('YYYY-MM-DD');
    params.to = moment(this.toDateValue).format('YYYY-MM-DD');
    this.invoiceService.searchInvoice(params).subscribe({
      next: (res: any) => {
        this.invoiceList = [];
        if (res && res.data) {
          res.data.invoice.forEach((item: any) => {
            item['class_no'] = this.getClassNo(this.classList, item.class);
          });
          this.invoiceList = res.data.invoice;
        }
      },
      error: (error) => {
        this.loading = false;
        this.searchInvoice = true;
        this.billLoading = false;
        this.dateLoading = false;
      },
      complete: () => {
        this.loading = false;
        this.searchInvoice = true;
        this.billLoading = false;
        this.dateLoading = false;
      }
    });
  }
  onSearchByBillid() {
    if(!this.billId) {
      return;
    }
    this.loading = true;
    const params: any = {};
    params.billId = this.billId;
    params.searchBy = this.searchBy;
    this.invoiceList = [];
    this.invoiceService.serachInvoiceByBillNo(params).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          res.data.forEach((item: any) => {
            item['class_no'] = this.getClassNo(this.classList, item.class);
          });
          this.invoiceList = res.data;
        }
      },
      error: (error) => {
        this.loading = false;
        this.searchInvoice = true;
        this.billLoading = false;
        this.dateLoading = false;
      },
      complete: () => {
        this.loading = false;
        this.searchInvoice = true;
        this.billLoading = false;
        this.dateLoading = false;
      }
    });
  }
  resetSearch(type?: string) {
    if (type == 'bill') {
      this.billId = '';
    } else {
      this.fromDateValue = '';
      this.toDateValue = '';
    }
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
  updateInvoice(id: any) {
    this.router.navigate(['invoice/update-invoice', id]);
  }
  public openConfirmationDialog(id: any) {
    this.confirmationDialogService.confirm('Confirmation', "Are you sure you want delete?",
        "Okay", "Cancel","danger", "secondary")
        .then((confirmed) => {
            console.log('User confirmed:', confirmed);
            if (confirmed) {
              this.deleteInvoice(id);
            }
      })
       .catch(() => {
       console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
    });
  }
  deleteInvoice(id: any) {
    const invoiceId = [];
    invoiceId.push(id);
    const params: any = {};
    params.invoiceId = invoiceId;
    this.invoiceService.deleteInvoice(params).subscribe({
      next: (res) => {
        if (res && res.message) {
          this.invoiceList = this.invoiceList.filter((item: any) => item.invoice_id !== id);
        }
      },
      error: (error) => {
      },
      complete: () => {
      }
    });
  }
  generatePdf(type: string, data: any) {
      this.invoiceDetails = [];
      let printData: any = {};
      this.invoiceService.getInvoiceDetails(data.invoice_id)
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
          console.log(new Date(this.invoiceDetails?.created_at));
          this.invoicePrintService.generatePdf(printData, new Date(this.invoiceDetails?.date), this.classList, type);
        }
      });
  }

}
