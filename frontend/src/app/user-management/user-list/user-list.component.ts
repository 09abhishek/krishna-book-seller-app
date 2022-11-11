import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList: any = [];
  loading = false;
  userType = [
    {name: 'Admin', type: 'admin'},
    {name: 'Super Admin', type: 'super_admin'},
    {name: 'Accountant', type: 'accountant'},
  ]
  constructor(
    public userService: UserService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.userService.getUserList().subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.data) {
          this.userList = res.data;
        }
      },
      error: (error) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  getuserType(type: string) {
    let userType = ''
    this.userType.forEach((item: any) => {
      if (item.type == type) {
        userType = item.name;
      }
    })
    return userType;
  }
  public openConfirmationDialog(id: any) {
    this.confirmationDialogService.confirm('Confirmation', "Are you sure you want delete?",
        "Okay", "Cancel","danger", "secondary")
        .then((confirmed) => {
            console.log('User confirmed:', confirmed);
            if (confirmed) {
              this.deleteUserList(id);
            }
      })
       .catch(() => {
       console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
    });
  }
  deleteUserList(id: any) {
    const userId = [];
    userId.push(id);
    const params: any = {};
    params.userId = userId;
    this.userService.deleteUser(params).subscribe({
      next: (res) => {
        if (res && res.message) {
          this.userList = this.userList.filter((item: any) => item.id !== id);
        }
      },
      error: (error) => {
      },
      complete: () => {
      }
    });
  }
  updateUser(id: any) {
    this.router.navigate(['user/update/', id]);
    }

}
