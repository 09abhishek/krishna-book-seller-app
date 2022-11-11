import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() title: string = '';
  @Input() message: string = '';
  @Input() btnOkText: string = '';
  @Input() btnCancelText: string = '';
  @Input() btnOkColor: string = '';
  @Input() btnCancelColor: string = '';

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
