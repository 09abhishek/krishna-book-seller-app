import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BookManagementService } from '../book-management.service';
import { Subscription } from 'rxjs';
import {each, groupBy} from 'lodash';

@Component({
  selector: 'app-manage-publication-update',
  templateUrl: './manage-publication-update.component.html',
  styleUrls: ['./manage-publication-update.component.scss']
})
export class ManagePublicationUpdateComponent implements OnInit {

  publicationDetails: any;
  public publicationUpdateForm: any;
  private subscriptions: any = {};
  submitLoader = false;
  publicationList: any = [];
  loading = false;
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
  constructor( public route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public bookManagementService: BookManagementService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.initForm();
    this.publicationDetails = localStorage.getItem('publicationDetails')  ? JSON.parse(localStorage.getItem('publicationDetails')!) : '';
    console.log(this.publicationDetails);
    this.fillPublicationForm(this.publicationDetails);
    // this.route.queryParams.subscribe( (params: any) => {
    //   if (params && params['publicationDetails']) {
    //     this.publicationDetails = JSON.parse(params['publicationDetails']);
    //     this.fillPublicationForm(this.publicationDetails);
    //   }
    //  });
  }
  public initForm(): void {
    this.publicationUpdateForm = this.fb.group({
      publicationName: ['', [Validators.required]],
  })
}
  onSaveConfirmation() {
    if (!this.publicationUpdateForm.valid) {
      this.validateAllFormFields(this.publicationUpdateForm);
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

  fillPublicationForm(publicationDetails : any) {
    this.publicationUpdateForm.controls['publicationName'].setValue(publicationDetails.name);
  }

  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Confirmation', "Are you sure you want to Update Publication!",
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
    const formValue = this.publicationUpdateForm.getRawValue();
    const publicationData = [];
    const params: any = {};
    params.id = this.publicationDetails.id;
    params.name = formValue.publicationName;
    publicationData.push(params);
    this.subscriptions['updateBook'] = this.bookManagementService.updatePublicationDetails(publicationData).subscribe({
      next: (res) => {
        if(res) {
          this.submitLoader = false;
          this.router.navigate(['/book-management/manage-publication']);
        }
      },
      error: (error)=> {
        this.submitLoader = false;
      }
    });
  }
  cancel() {
    this.router.navigate(['/book-management/manage-publication']);
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
  ngOnDestroy(): void {
    each(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
