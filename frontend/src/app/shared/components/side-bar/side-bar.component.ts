import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  items: MenuItem[] = [];
  userDetails = localStorage.getItem('userDetails')  ? JSON.parse(localStorage.getItem('userDetails')!) : '';

  constructor() { }

  ngOnInit(): void {
  }
}
