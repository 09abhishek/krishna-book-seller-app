import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { InvoiceService } from '../invoice.service';

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
  fromDateValue: any = '';
  toDateValue: any = '';
  billId: any = '';

  constructor(
    private messageService: MessageService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
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
      next: (res) => {
        if (res && res.data) {
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
    this.invoiceService.serachInvoiceByBillNo(params).subscribe({
      next: (res) => {
        if (res && res.data) {
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
  resetSearch() {
    this.billId = '';
    this.fromDateValue = '';
    this.toDateValue = '';
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

}
