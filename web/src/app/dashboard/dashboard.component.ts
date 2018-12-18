import { Component, OnInit } from '@angular/core';
import { LedgerService } from '../services/ledger.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    ledgers: any;
    newLedger: any = {};

    constructor(private ledgerService:LedgerService) { }

    ngOnInit() {
        this.ledgerService.getCreated().subscribe((res:any) => {
            this.ledgers = res.ledgers
        })
    }

    createLedger(){
        this.newLedger.extraUsers = ['hey', 'ho', 'hi'];
        this.ledgerService.create(this.newLedger).subscribe((res:any) => {
            console.log(res.message);
        })
    }

}
