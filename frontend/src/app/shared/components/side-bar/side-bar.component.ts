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
      label: 'Dashboard',
      items: [{
        label: 'Home',
        routerLink: '/dashboard',
        icon: 'pi pi-home'
      }]
      },
      {
      label: 'Invoice',
      items: [{
        label: 'Invoice',
        routerLink: '/invoice/list',
        icon: 'pi pi-book'
     },
     {
      label: 'Search Invoice',
      routerLink: '/invoice/search-invoice',
      icon: 'pi pi-book'
     }],
      },
      {
          label: 'Master',
          items: [{
              label: 'Add Qty',
              icon: 'pi pi-plus-circle'
          },
          {
              label: 'Add Item And Qty',
              routerLink: '/fileupload',
              icon: 'pi pi-plus-circle',
              routerLinkActiveOptions: {exact: true}
          },
          {
              label: 'Delete Item',
              routerLink: '/fileupload',
              icon: 'pi pi-trash',
              routerLinkActiveOptions: {exact: true}
          },
      ]},
      {
          label: 'Report',
          items: [{
              label: 'Daily Collection',
              routerLink: '/report/collection-report',
              icon: 'pi pi-file',
          },
          {
              label: 'Grant Collection',
              routerLink: '/report/grant-collection-report',
              icon: 'pi pi-file',
          },
          {
              label: 'All Book Stock Report',
              routerLink: '/report/book-stock-report',
              routerLinkActiveOptions: {exact: true},
              icon: 'pi pi-file',
          },
          {
              label: 'Publication Report',
              routerLink: '/report/publication-report',
              routerLinkActiveOptions: {exact: true},
              icon: 'pi pi-file',
          },
          {
              label: 'All Book List',
              routerLink: '/report/all-book-list',
              routerLinkActiveOptions: {exact: true},
              icon: 'pi pi-file',
          },
      ]},
    //   {
    //       label: 'Dress Management',
    //       items: [{
    //           label: 'Dress Management',
    //       },
    //   ]
    // },
      {
          label: 'User Management',
          items: [{
              label: 'User Management',
              icon: 'pi pi-user',
          },
      ]
    }
  ];
  }
}
