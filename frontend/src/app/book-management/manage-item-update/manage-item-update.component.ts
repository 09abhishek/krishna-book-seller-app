import { classList } from './../../shared/class-list';
import { Subscription } from 'rxjs';
import { BookManagementService } from './../book-management.service';
import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {each, groupBy} from 'lodash';

@Component({
  selector: 'app-manage-item-update',
  templateUrl: './manage-item-update.component.html',
  styleUrls: ['./manage-item-update.component.scss']
})
export class ManageItemUpdateComponent implements OnInit {

  bookDetails: any;
  public bookUpdateForm: any;
  private subscriptions: any = {};
  submitLoader = false;
  publicationList: any = [];
  classList: any = classList;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public bookManagementService: BookManagementService,
    private confirmationDialogService: ConfirmationDialogService
    ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getpublicationList();
    this.bookDetails = localStorage.getItem('BookDetails')  ? JSON.parse(localStorage.getItem('BookDetails')!) : '';
    this.fillbookForm(this.bookDetails);
  }
  public initForm(): void {
    this.bookUpdateForm = this.fb.group({
      bookname: ['', [Validators.required]],
      class: ['', [Validators.required]],
      publication: ['', [Validators.required]],
      Quantity: [''],
      mrp: ['', [Validators.required]],
      netprice: ['', [Validators.required]],
    });
  }
  onSaveConfirmation() {
    if (!this.bookUpdateForm.valid) {
      this.validateAllFormFields(this.bookUpdateForm);
      return;
    }
    this.openConfirmationDialog();
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
  getpublicationList() {
    this.subscriptions['publicationList'] = this.bookManagementService.getPublicationList().subscribe((res: any) => {
      if(res && res.data) {
        this.publicationList = res.data;
      }
    });
  }
fillbookForm(bookDetails : any) {
  this.bookUpdateForm.controls['bookname'].setValue(bookDetails.name);
  this.bookUpdateForm.controls['class'].setValue(bookDetails.class);
  this.bookUpdateForm.controls['publication'].setValue(bookDetails.publication_id);
  this.bookUpdateForm.controls['Quantity'].setValue(bookDetails.quantity);
  this.bookUpdateForm.controls['mrp'].setValue(bookDetails.mrp);
  this.bookUpdateForm.controls['netprice'].setValue(bookDetails.net_price);
  this.bookUpdateForm.controls['Quantity'].disable();
}

  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Confirmation', "Are you sure you want to Update Book!",
        "Okay", "Cancel","primary", "secondary")
        .then((confirmed) => {
            console.log('User confirmed:', confirmed);
            if (confirmed) {
              this.SaveUser();
            }
      })
       .catch(() => {
       console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
    });
  }
  SaveUser() {
    this.submitLoader = true;
    const formValue = this.bookUpdateForm.getRawValue();
    const bookData = [];
    const params: any = {};
    params.id = this.bookDetails.id;
    params.name = formValue.bookname;
    params.class = formValue.class;
    params.publicationId = formValue.publication;
    params.quantity = formValue.Quantity;
    params.mrp = formValue.mrp;
    params.netPrice = formValue.netprice;
    bookData.push(params);
    this.subscriptions['updateBook'] = this.bookManagementService.updateBookDetails(bookData).subscribe({
      next: (res: any) => {
        if(res) {
          this.submitLoader = false;
          this.router.navigate(['/book-management/manage-item'], { queryParams: { classId: this.bookUpdateForm.value.class}});
        }
      },
      error: (error: any)=> {
        this.submitLoader = false;
      }
    });
  }
  cancel() {
    this.router.navigate(['/book-management/manage-item'], { queryParams: { classId: this.bookUpdateForm.value.class}});
  }
  ngOnDestroy(): void {
    each(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
