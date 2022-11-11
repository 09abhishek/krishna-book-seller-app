import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ConfirmationDialogComponent} from './confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal) {
  }

  public confirm(title: string,
                 message: string,
                 btnOkText: string = 'OK',
                 btnCancelText: string = 'Cancel',
                 btnOkColor: string = 'danger',
                 btnCancelColor: string = 'secondary',
                 dialogSize: 'sm' | 'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      size: dialogSize,
      windowClass: 'confirm-dialogue'
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.btnOkColor = btnOkColor;
    modalRef.componentInstance.btnCancelColor = btnCancelColor;

    return modalRef.result;
  }

}
