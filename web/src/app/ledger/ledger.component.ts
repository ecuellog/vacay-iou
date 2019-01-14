import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LedgerService } from '../services/ledger.service';

@Component({
    selector: 'app-ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
    ledger = {};
    transactions = [];
    newTransaction: any = {
        type: "",
        whoPaid: ['Ed'],
        whoBenefited: ['Sylvia']
    };
    id = this.route.snapshot.paramMap.get('id');


    constructor(
        private ledgerService: LedgerService,
        private route: ActivatedRoute
    ){}

    ngOnInit() {
        this.queryLedger();
        this.queryTransactions();
    }

    queryLedger(){
        this.ledgerService.get(this.id).subscribe((res:any) => {
            this.ledger = res.ledger;
            console.log(res);
        });
    }

    queryTransactions(){
        this.ledgerService.getAllTransactions(this.id).subscribe((res:any) => {
            this.transactions = res.transactions;
            console.log(res);
        });
    }

    createTransaction(){
        console.log('creating transaction...')
        this.newTransaction.type = 'expense';
        this.ledgerService.createTransaction(this.id, this.newTransaction).subscribe((res:any) => {
            console.log(res.message);
            this.newTransaction = {};
            this.queryTransactions();
        });
    }
}
