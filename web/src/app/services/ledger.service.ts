import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

//move to a config file
const API_URL = 'http://localhost:3000/api';
const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class LedgerService {

    constructor(private http: HttpClient) {}

    getCreated(){
        return this.http.get(API_URL + '/ledgers/created');
    }

    get(ledgerId){
        return this.http.get(API_URL + '/ledgers/' + ledgerId);
    }

    create(body){
        return this.http.post(API_URL + '/ledgers', body);
    }

    getAllTransactions(ledgerId){
        return this.http.get(API_URL + '/ledgers/' + ledgerId + '/transactions');
    }

    createTransaction(ledgerId, body){
        return this.http.post(API_URL + '/ledgers/' + ledgerId + '/transactions', body);
    }
}
