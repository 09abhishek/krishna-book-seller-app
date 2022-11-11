import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageItemUpdateComponent } from './manage-item-update.component';

describe('ManageItemUpdateComponent', () => {
  let component: ManageItemUpdateComponent;
  let fixture: ComponentFixture<ManageItemUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageItemUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageItemUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
