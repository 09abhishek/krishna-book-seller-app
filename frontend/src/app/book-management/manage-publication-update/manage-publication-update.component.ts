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
  constructor( public route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public bookManagementService: BookManagementService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe( (params: any) => {
      if (params && params['publicationDetails']) {
        this.publicationDetails = JSON.parse(params['publicationDetails']);
        this.fillPublicationForm(this.publicationDetails);
      }
     });
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
        "Okay", "Cancel","success", "secondary")
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
  ngOnDestroy(): void {
    each(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
