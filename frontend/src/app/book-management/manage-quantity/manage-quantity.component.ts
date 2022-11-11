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
  classList: any = [
    {id: 1, name: 'infant', value: 'infant'},
    {id: 2, name: 'nursery', value: 'nursery'},
    {id: 3, name: 'prep', value: 'prep'},
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
          params.stdClass = data.class;
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
        params.stdClass = item.stdClass;
        params.publicationId = item.publicationId;
        params.mrp = item.mrp;
        params.netPrice = item.netPrice;
        params.quantity = item.quantity;
        updatedBookDetails.push(params);
      });
    }
    this.subscriptions['updateBook'] = this.bookManagementService.updateBookDetails(updatedBookDetails).subscribe({
      next: (res) => {
        if(res) {
          this.submitLoader = false;
        }
      },
      error: (error)=> {
        this.submitLoader = false;
      }
    });
  }
  cancel() {
      this.selectedBook = [];
      this.selectedBookIds = [];
      this.classId = '';
      this.bookList = [];
  }

  ngOnDestroy(): void {
      each(this.subscriptions, (subscription: Subscription) => {
        subscription.unsubscribe();
      });
    }
}
