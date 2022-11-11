import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppService } from './../../app.serveice';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: any;
  submitLoader = false;
  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit(): void {
    this.initLoginForm();
  }
  public initLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['',  [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  public doLogin() {
    if (!this.loginForm.valid) {
      this.validateAllFormFields(this.loginForm);
      return;
    }
    this.submitLoader = true;
    this.appService.doLogin(this.loginForm.value).subscribe({
      next: (res) => {
          if (res && res.user && res.user.id) {
            this.messageService.add({severity:'success', summary: 'Success', detail: "Login SuccessFully"});
            localStorage.setItem('userDetails', JSON.stringify(res.user));
            localStorage.setItem('tokensDetails', JSON.stringify(res.tokens));
            localStorage.setItem('token', (res?.tokens?.access?.token));
            localStorage.setItem('refreshTokenDetails', JSON.stringify(res.refresh));
            this.router.navigate(['/dashboard']);
          }
      },
      error: (error) => {
        this.submitLoader = false;
      },
      complete: () => {
        this.submitLoader = false;
      }
  });
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

}
