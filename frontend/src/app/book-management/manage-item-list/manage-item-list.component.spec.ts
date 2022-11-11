import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageItemListComponent } from './manage-item-list.component';

describe('ManageItemListComponent', () => {
  let component: ManageItemListComponent;
  let fixture: ComponentFixture<ManageItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageItemListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
