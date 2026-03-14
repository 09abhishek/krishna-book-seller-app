import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { each } from 'lodash';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  public userForm: any;
  private subscriptions: any = {};
  submitLoader = false;
  userId: any;
  userDetails: any;
  showPrivilage = false;
  userType = [
    {name: 'Super Admin', type: 'super_admin'},
    {name: 'Admin', type: 'admin'},
    {name: 'Accountant', type: 'accountant'},
  ]

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.initForm();
    this.getRouteParams();
  }

  getRouteParams() {
    this.route.params.subscribe((params: any) => {
      if (params && params.id) {
        this.userId = params.id;
        this.getUserDetails(this.userId);
        this.showPrivilage = true;
      } else {
        this.setPasswordValidatiors();
      }
    });
  }

  getUserDetails(id: any) {
    this.subscriptions['getUserDetails'] = this.userService.getUserDetails(id).subscribe({
      next: (res: any) => {
        if(res && res.data) {
          this.userDetails = res.data[0];
          this.filluserForm(this.userDetails);
        }
      },
      error: (error: any)=> {
        console.error("Error fetching user", error);
      }
    });
  }

  public initForm(): void {
    this.userForm = this.fb.group({
        username: ['', [Validators.required]],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        mobno: [''],
        privalageType: ['', [Validators.required]],
        password: ['', [Validators.minLength(5)]],
        confirmPassword: ['']
      },
      { validator: this.mismatchingPasswords('password', 'confirmPassword') }
    );
  }

  isSubmitDisabled(): boolean {
    if (this.userForm.invalid) {
      return true;
    }
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;
    if (!password || !confirmPassword || password.trim() === '' || confirmPassword.trim() === '') {
      return true;
    }
    if (password !== confirmPassword) {
      return true;
    }
    return false;
  }

  onSaveConfirmation() {
    if (!this.userForm.valid) {
      this.validateAllFormFields(this.userForm);
      return;
    }
    this.openConfirmationDialog();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  mismatchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): any => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (!password || !confirmPassword) { return null; }

      // Update के समय अगर पासवर्ड खाली है तो कोई एरर न दें
      if (!password.value && !confirmPassword.value) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ ...confirmPassword.errors, mismatchedPasswords: true });
        return { mismatchedPasswords: true };
      } else {
        if (confirmPassword.hasError('mismatchedPasswords')) {
          const errors = { ...confirmPassword.errors };
          delete errors['mismatchedPasswords'];
          confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
        return null;
      }
    };
  }

  filluserForm(details: any) {
    this.userForm.get('username').setValue(details.username);
    this.userForm.get('firstname').setValue(details.first_name);
    this.userForm.get('lastname').setValue(details.last_name);
    this.userForm.get('privalageType').setValue(details.user_type);

    this.userForm.get('username').disable();
    this.userForm.get('firstname').disable();
    this.userForm.get('lastname').disable();
    if (details.user_type !== 'super_admin') {
      this.userForm.get('privalageType').disable();
    }
  }

  setPasswordValidatiors() {
    this.userForm.get('password').setValidators([Validators.required, Validators.minLength(5)]);
    this.userForm.get('password').updateValueAndValidity();
    this.userForm.get('confirmPassword').setValidators([Validators.required]);
    this.userForm.get('confirmPassword').updateValueAndValidity();
  }

  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Confirmation', "Are you sure to save!", "Okay", "Cancel", "primary", "secondary")
      .then((confirmed) => {
        if (confirmed) {
          this.SaveUser();
        }
      })
      .catch(() => {
        console.log('Dialog dismissed');
      });
  }

  SaveUser() {
    this.submitLoader = true;
    const formValue = this.userForm.getRawValue();
    const params: any = {};

    if (this.userId) {
      // --- UPDATE OPERATION (Joi Validation के अनुसार) ---
      params.id = this.userId;

      if (formValue.password) {
        params.password = formValue.password;
      }

      params.userType = formValue.privalageType; // बैकएंड userType मांगता है

      this.subscriptions['updateUser'] = this.userService.updateUser(params).subscribe({
        next: (res: any) => {
          if(res) {
            this.submitLoader = false;
            this.router.navigate(['/user/list']);
          }
        },
        error: (error: any)=> {
          this.submitLoader = false;
        }
      });

    } else {
      // --- CREATE OPERATION ---
      params.username = formValue.username;
      params.firstName = formValue.firstname;
      params.lastName = formValue.lastname;
      if (formValue.mobno) {
        params.mobileNum = formValue.mobno;
      }
      params.userType = formValue.privalageType;
      params.password = formValue.password;

      this.subscriptions['saveUser'] = this.userService.register(params).subscribe({
        next: (res: any) => {
          if(res) {
            this.submitLoader = false;
            this.userForm.reset();
          }
        },
        error: (error: any)=> {
          this.submitLoader = false;
        }
      });
    }
  }

  reset() {
    if(this.userId) {
      this.router.navigate(['/user/list']);
    } else {
      this.userForm.reset();
    }
  }

  ngOnDestroy(): void {
    each(this.subscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
