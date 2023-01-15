import { classList } from './../../shared/class-list';
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
  classList: any = classList;
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
      next: (res: any) => {
        if(res) {
          this.submitLoader = false;
          this.router.navigate(['/book-management/manage-publication']);
        }
      },
      error: (error: any)=> {
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
