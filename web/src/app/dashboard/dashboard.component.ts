import { Component, OnInit } from '@angular/core';
import { LedgerService } from '../services/ledger.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    ledgers: any = {};
    newLedger: any = {
        persons: []
    };
    numPersons = 1;
    person = {};

    constructor(private ledgerService:LedgerService) { }

    ngOnInit() {
        this.queryLedgers();
    }

    createLedger(){
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
}
