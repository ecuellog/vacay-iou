import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private authService:AuthService, private router:Router) {
        if(authService.isAuthenticated()){
            router.navigate(['dashboard']);
        }
    }

    model: any = {};

    ngOnInit() {
        this.authService.getUsers().subscribe((users) => {
            console.log(users);
        })
    }

    login() {
        this.authService.login(this.model).subscribe((res:any) => {
            console.log(res.message);
            this.router.navigate(['dashboard']);
        });
    }

}
