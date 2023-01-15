import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  userDetails: any;
  userInfo: any;
  userType = [
    {name: 'Admin', type: 'admin'},
    {name: 'Super Admin', type: 'super_admin'},
    {name: 'Accountant', type: 'accountant'},
  ]
  constructor(private userService: UserService) {
    this.userDetails = localStorage.getItem('userDetails')  ? JSON.parse(localStorage.getItem('userDetails')!) : '';
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUserDetails(this.userDetails.id).subscribe({
      next: (res: any) => {
        if(res && res.data) {
          this.userInfo = res.data[0];
        }
      },
      error: (error)=> {
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
}
