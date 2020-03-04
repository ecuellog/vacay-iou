import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav-side-dashboard',
  templateUrl: './nav-side-dashboard.component.html',
  styleUrls: ['./nav-side-dashboard.component.scss']
})
export class NavSideDashboardComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

}
