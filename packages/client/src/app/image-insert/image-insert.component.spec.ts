import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageInsertComponent } from './image-insert.component';

describe('ImageInsertComponent', () => {
  let component: ImageInsertComponent;
  let fixture: ComponentFixture<ImageInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageInsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
