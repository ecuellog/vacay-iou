import { Component, OnInit } from '@angular/core';
import { LedgerService } from '../services/ledger.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    currentUser: any;
    ledgers: any = {};
    newLedger: any = {
        persons: []
    };
    numPersons = 1;
    person = {};

    constructor(private ledgerService:LedgerService, private userService:UserService) { }

    ngOnInit() {
        this.getCurrentUser();
        this.queryLedgers();
    }

    createLedger(){
        //Add the current user's name
        this.newLedger.persons.push(this.currentUser.name);
        console.log(this.currentUser.name);

        //Add persons in input to person list.
        for(var i = 0; i < this.numPersons; i++){
            if(this.person[i] === "" || this.person[i] === undefined) continue;
            this.newLedger.persons.push(this.person[i]);
             console.log(this.person[i]);
        }

        this.ledgerService.create(this.newLedger).subscribe((res:any) => {
            console.log(res.message);
        })
        this.queryLedgers();
    }

    addPerson() {
        this.numPersons++;
    }

    range(n: number): number[] {
        return Array.from(Array(n).keys());
    }

    queryLedgers(){
        this.ledgerService.getCreated().subscribe((res:any) => {
            this.ledgers = res.ledgers
            console.log(res.ledgers);
        })
    }

    getCurrentUser(){
        this.userService.getCurrentUser().subscribe((res:any) => {
            this.currentUser = res.user;
            console.log(this.currentUser);
        });
    }
}
