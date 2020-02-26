import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    credentials: any = {};

    constructor(private authService:AuthService, private router:Router) {
        if(authService.isAuthenticated()){
            router.navigate(['dashboard']);
        }
    }

    ngOnInit() {
        this.authService.getUsers().subscribe((users) => {
            console.log(users);
        })
    }

    login() {
        this.authService.login(this.credentials).subscribe((res:any) => {
            console.log(res.message);
            this.router.navigate(['dashboard']);
        });
    }

}
