import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  items: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.menuItems();
  }
  menuItems() {
    this.items = [{
      label: 'Invoice',
      items: [{
        label: 'Invoice',
        routerLink: '/invoice/list'
     }],
      },
      {
          label: 'Master',
          items: [{
              label: 'Add Qty',
          },
          {
              label: 'Add Item And Qty',
              routerLink: '/fileupload',
              routerLinkActiveOptions: {exact: true}
          },
          {
              label: 'Delete Item',
              routerLink: '/fileupload',
              routerLinkActiveOptions: {exact: true}
          },
      ]},
      {
          label: 'Report',
          items: [{
              label: 'Collection Report',
              routerLink: '/report/collection-report',
          },
          {
              label: 'All Book Stock Report',
              routerLink: '/report/book-stock-report',
              routerLinkActiveOptions: {exact: true}
          },
          {
              label: 'Publication Report',
              routerLink: '/report/publication-report',
              routerLinkActiveOptions: {exact: true}
          },
          {
              label: 'All Book List',
              routerLink: '/report/all-book-list',
              routerLinkActiveOptions: {exact: true}
          },
      ]},
      {
          label: 'Dress Management',
          items: [{
              label: 'Dress Management',
          },
      ]
    },
      {
          label: 'User Management',
          items: [{
              label: 'User Management',
          },
      ]
    }
  ];
  }
}
