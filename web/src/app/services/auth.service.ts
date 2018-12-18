import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
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
export class AuthService {
    constructor(private http: HttpClient, private cookies: CookieService) {
        console.log('AuthService Initialized...');
    }

    login(body){
        return this.http.post(API_URL + '/auth/login', body/*, { withCredentials: true }*/)
    }

    getUsers(){
        return this.http.get(API_URL + '/user');
    }

    //Should probably do an API call to actually confirm tokens are valid
    isAuthenticated(){
        if(this.cookies.check('csrf-token')) return true;
        return false;
    }
}
