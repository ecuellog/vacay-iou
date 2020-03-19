import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LedgerService } from '@/services/ledger.service';
import { UserService } from '@/services/user.service';

@Component({
  selector: 'app-nav-side-dashboard',
  templateUrl: './nav-side-dashboard.component.html',
  styleUrls: ['./nav-side-dashboard.component.scss']
})
export class NavSideDashboardComponent implements OnInit {
  private persons: string[] = [];
  private ledgerName: string = '';
  private currentUser: any;
  private person: string;

  constructor(private modalService: NgbModal, private ledgerService: LedgerService, private userService: UserService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((res:any) => {
      this.currentUser = res.user;
      this.persons.push(this.currentUser.name);
    });
  }

  openModal(modalName: TemplateRef<any>) {
    this.modalService.dismissAll();
    this.modalService.open(modalName);
  }

  createLedger() {
    this.ledgerService.create({
      persons: this.persons,
      name: this.ledgerName
    }).subscribe((res) => {
      alert('created');
      console.log('created ledger');
      this.modalService.dismissAll();
      this.persons = [this.currentUser.name];
      this.ledgerName = '';
    })
  }

  addPerson() {
    this.persons.push(this.person);
    this.person = '';
  }

  deletePerson(personIndex: number) {
    this.persons.splice(personIndex, 1);
  }

}
