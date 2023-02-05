import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudStructureComponent } from './cloud-structure.component';

describe('CloudStructureComponent', () => {
  let component: CloudStructureComponent;
  let fixture: ComponentFixture<CloudStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloudStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloudStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
