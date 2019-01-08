import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LedgerService } from '../services/ledger.service';

@Component({
    selector: 'app-ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
    ledger: any;

    constructor(
        private ledgerService: LedgerService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.queryLedger();
    }

    queryLedger(){
        const id = this.route.snapshot.paramMap.get('id');
        this.ledgerService.get(id).subscribe((res:any) => {
            this.ledger = res.ledger;
            console.log(res);
        });
    }
}
