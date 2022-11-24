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
    // this.route.queryParams.subscribe( (params: any) => {
    //   if(params) {
    //     this.bookDetails = JSON.parse(params['BookDetails']);
    //     this.fillbookForm(this.bookDetails);
    //   }
    //  }
    // )
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
      next: (res) => {
        if(res) {
          this.submitLoader = false;
          this.router.navigate(['/book-management/manage-item'], { queryParams: { classId: this.bookUpdateForm.value.class}});
        }
      },
      error: (error)=> {
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
