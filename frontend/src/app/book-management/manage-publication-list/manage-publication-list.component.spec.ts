import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePublicationListComponent } from './manage-publication-list.component';

describe('ManagePublicationListComponent', () => {
  let component: ManagePublicationListComponent;
  let fixture: ComponentFixture<ManagePublicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePublicationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePublicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
