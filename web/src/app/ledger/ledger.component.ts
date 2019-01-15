import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LedgerService } from '../services/ledger.service';

@Component({
    selector: 'app-ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
    ledger: any = {};
    transactions = [];

    //Used for transaction creation
    personsPaid: boolean[] = [];
    personsBenefited: boolean[] = [];
    
    newTransaction: any = {
        type: "",
        whoPaid: [],
        whoBenefited: []
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
            for(let i in this.ledger.persons){
                this.personsPaid[i] = false;
                this.personsBenefited[i] = false;
            }
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
        for(let i in this.ledger.persons){
            if(this.personsPaid[i]) this.newTransaction.whoPaid.push(this.ledger.persons[i]);
            if(this.personsBenefited[i]) this.newTransaction.whoBenefited.push(this.ledger.persons[i]);
        }
        this.newTransaction.type = 'expense';
        this.ledgerService.createTransaction(this.id, this.newTransaction).subscribe((res:any) => {
            console.log(res.message);
            this.newTransaction = {};
            this.queryTransactions();
        });
    }
}
