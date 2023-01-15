import { classList } from './../../shared/class-list';
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
  classList: any = classList;

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
      next: (res: any) => {
        this.intialPageLoaded = true;
        this.loading = false;
        if (res && res.data) {
          res.data.forEach((item: any) => {
            item['class_no'] = this.getClassNo(this.classList, item.class);
          })
          this.bookStoreList = res.data;
        }
      },
      error: (error: any) => {
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
    next: (res: any) => {
      if (res && res.message) {
        this.bookStoreList = this.bookStoreList.filter((item: any) => item.id !== id);
      }
    },
    error: (error: any) => {
    },
    complete: () => {
    }
  });
}

  updateBook(data: any) {
    localStorage.setItem('BookDetails' ,JSON.stringify(data));
  this.router.navigate(['book-management/manage-item-update']);
  }

}
