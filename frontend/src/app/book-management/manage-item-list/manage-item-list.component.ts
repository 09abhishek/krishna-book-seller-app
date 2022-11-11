import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { Component, OnInit } from '@angular/core';
import { BookManagementService } from '../book-management.service';

@Component({
  selector: 'app-manage-item-list',
  templateUrl: './manage-item-list.component.html',
  styleUrls: ['./manage-item-list.component.scss']
})
export class ManageItemListComponent implements OnInit {

  intialPageLoaded = false;
  bookStoreList: any = [];
  loading = false;
  classId: any;
  todayDate: any = new Date();
  private subscriptions: any = {};
  printExportData: any = [];
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

  constructor(
    public bookManagementService: BookManagementService,
    private router: Router,
    public route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params: any) => {
      if(params && params.classId) {
        this.classId = params['classId'];
        const event: any = {};
        event.value = this.classId;
        this.onChangeClass(event);
      }
     });
  }

onChangeClass(event: any) {
    this.classId = event.value;
    this.loading = true;
    this.bookManagementService.getbookstoreList(this.classId).subscribe({
      next: (res) => {
        this.intialPageLoaded = true;
        this.loading = false;
        if (res && res.data) {
          this.bookStoreList = res.data;
        }
      },
      error: (error) => {
        this.loading = false;
        this.intialPageLoaded = true;
      },
      complete: () => {
        this.loading = false;
        this.intialPageLoaded = true;
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
  return val;
}
public openConfirmationDialog(id: any) {
  this.confirmationDialogService.confirm('Confirmation', "Are you sure you want delete?",
      "Okay", "Cancel","danger", "secondary")
      .then((confirmed) => {
          console.log('User confirmed:', confirmed);
          if (confirmed) {
            this.deleteBook(id);
          }
    })
     .catch(() => {
     console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
  });
}
deleteBook(id: any) {
  const bookId = [];
  bookId.push(id);
  const params: any = {};
  params.bookId = bookId;
  this.bookManagementService.deleteBook(params).subscribe({
    next: (res) => {
      if (res && res.message) {
        this.bookStoreList = this.bookStoreList.filter((item: any) => item.id !== id);
      }
    },
    error: (error) => {
    },
    complete: () => {
    }
  });
}

  updateBook(data: any) {
  this.router.navigate(['book-management/manage-item-update'], { queryParams: { BookDetails: JSON.stringify(data)}});
  }

}
