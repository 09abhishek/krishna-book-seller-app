import { classList } from './../../shared/class-list';
import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { Component, OnInit } from '@angular/core';
import { BookManagementService } from '../book-management.service';
import { Subscription } from 'rxjs';
import {each, groupBy} from 'lodash';

@Component({
  selector: 'app-manage-quantity',
  templateUrl: './manage-quantity.component.html',
  styleUrls: ['./manage-quantity.component.scss']
})
export class ManageQuantityComponent implements OnInit {

  bookList: any = [];
  classId: any;
  intialPageLoader = false;
  selectedBookIds: any = [];

  selectedBook: any = [];
  submitLoader = false;
  private sub: any;
  private subscriptions: any = {};
  selectedBookListByid: any = {};
  classList: any = classList;
  constructor(public bookManagementService: BookManagementService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {

  }
  onChangeClass(val: any) {
    this.intialPageLoader = true;
    this.classId = val.value;
    this.subscriptions['bookList'] = this.bookManagementService.getbookstoreList(this.classId)
    .subscribe((item: any) => {
      this.intialPageLoader = false;
      this.bookList = [];
      this.selectedBookIds = [];
      this.selectedBook = [];
      if(item && item.data) {
        item.data.forEach((data: any) => {
          const params: any = {};
          params.id = data.id;
          params.name = data.name;
          params.class = data.class;
          params.publicationId = data.publication_id;
          params.mrp = data.mrp;
          params.netPrice = data.net_price;
          params.quantity = data.quantity;
          params.oldquantity = data.quantity;
          this.bookList.push(params);
          this.selectedBookIds.push(data.id)
        });
        this.selectedBook = this.bookList;
      }
    });
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

  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Confirmation', 'Are you sure you want to save?',
        "Okay", "Cancel","primary", "secondary")
        .then((confirmed) => {
            console.log('User confirmed:', confirmed);
            if (confirmed) {
              this.updateBook();
            }
      })
        .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
    });
  }

  updateBook() {
    const updatedBookDetails: any = [];
    if (this.selectedBook.length > 0) {
      this.selectedBook.forEach((item: any) => {
        const params: any = {};
        params.id = item.id;
        params.name = item.name;
        params.class = item.stdClass;
        params.publicationId = item.publicationId;
        params.mrp = item.mrp;
        params.netPrice = item.netPrice;
        params.quantity = item.quantity ? Number(item.quantity) : '';
        updatedBookDetails.push(params);
      });
    }
    this.subscriptions['updateBook'] = this.bookManagementService.updateBookDetails(updatedBookDetails).subscribe({
      next: (res: any) => {
        if(res) {
          this.submitLoader = false;
          const parms: any = {};
          parms.value = this.classId;
          this.onChangeClass(parms);
        }
      },
      error: (error: any)=> {
        this.submitLoader = false;
      }
    });
  }
  cancel() {
    const parms: any = {};
    parms.value = this.classId;
    this.onChangeClass(parms);
  }

  ngOnDestroy(): void {
      each(this.subscriptions, (subscription: Subscription) => {
        subscription.unsubscribe();
      });
    }
}
