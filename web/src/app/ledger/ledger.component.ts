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
    balances = new Map();

    //Used for transaction creation
    personsPaid: boolean[] = [];
    personsBenefited: boolean[] = [];
    
    newTransaction: any;

    id = this.route.snapshot.paramMap.get('id');


    constructor(
        private ledgerService: LedgerService,
        private route: ActivatedRoute
    ){}

    ngOnInit() {
        this.queryLedger();
        this.queryTransactions();
        this.resetNewTransaction();
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
            this.calculateSummary();
        });
    }

    resetNewTransaction(){
        this.newTransaction = {
            type: "",
            whoPaid: [],
            whoBenefited: []
        };
    }

    calculateSummary(){
        this.ledger.persons.forEach(person => {
            this.balances.set(person, 0);
            this.transactions.forEach(transaction => {
                if(transaction.whoPaid.includes(person)){
                    this.balances.set(person, this.balances.get(person) + transaction.amountDollars/transaction.whoPaid.length);
                }
                if(transaction.whoBenefited.includes(person)){
                    this.balances.set(person, this.balances.get(person) - transaction.amountDollars/transaction.whoBenefited.length);
                }
            });
            console.log(this.balances.get(person));
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
            this.resetNewTransaction();
            this.queryTransactions();
        });
    }
}
