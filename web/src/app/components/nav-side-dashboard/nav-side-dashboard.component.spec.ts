import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSideDashboardComponent } from './nav-side-dashboard.component';

describe('NavSideDashboardComponent', () => {
  let component: NavSideDashboardComponent;
  let fixture: ComponentFixture<NavSideDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavSideDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSideDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
