import { ConfirmationDialogService } from './../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { BookManagementService } from './../book-management.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-publication-list',
  templateUrl: './manage-publication-list.component.html',
  styleUrls: ['./manage-publication-list.component.scss']
})
export class ManagePublicationListComponent implements OnInit {

  publicationList: any = [];
  loading = true;
  constructor(
    public bookManagementService: BookManagementService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.bookManagementService.getPublicationList().subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.data) {
          this.publicationList = res.data;
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
  public openConfirmationDialog(id: any) {
    this.confirmationDialogService.confirm('Confirmation', "If publication is deleted all related books will be deleted, Please confirm!",
        "Okay", "Cancel","danger", "secondary")
        .then((confirmed) => {
            console.log('User confirmed:', confirmed);
            if (confirmed) {
              this.deletePublication(id);
            }
      })
       .catch(() => {
       console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
    });
  }
  deletePublication(id: any) {
    const publicationId = [];
    publicationId.push(id);
    const params: any = {};
    params.publicationId = publicationId;
    this.bookManagementService.deletePublication(params).subscribe({
      next: (res) => {
        if (res && res.message) {
          this.publicationList = this.publicationList.filter((item: any) => item.id !== id);
        }
      },
      error: (error) => {
      },
      complete: () => {
      }
    });
  }
  updatePublication(data: any) {
    localStorage.setItem('publicationDetails', JSON.stringify(data));
    this.router.navigate(['book-management/manage-publication-update']);
    }
}
