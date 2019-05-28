import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  newUser: any = {};

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.newUser).subscribe((res:any) => {
      console.log(res.message);
      this.router.navigate(['/login']);
    }, (res:any) => {
      alert(res.error.message);
      console.log(res);
    });
  }
}
