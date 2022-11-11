import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePublicationUpdateComponent } from './manage-publication-update.component';

describe('ManagePublicationUpdateComponent', () => {
  let component: ManagePublicationUpdateComponent;
  let fixture: ComponentFixture<ManagePublicationUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePublicationUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePublicationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
