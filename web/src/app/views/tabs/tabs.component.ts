import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@/services/ledger.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  tabs: any = [];

  constructor(private ledgerService: LedgerService) { }

  ngOnInit() {
    // Fetch all the user's tabs
    this.ledgerService.getCreated().subscribe((res:any) => {
      this.tabs = res.ledgers
      console.log(res.ledgers);
    })
  }

}
