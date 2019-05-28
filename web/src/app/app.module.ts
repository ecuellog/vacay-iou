
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './services/guards/auth-guard.service';
import { AuthService } from './services/auth.service';
import { LedgerService } from './services/ledger.service';
import { UserService } from './services/user.service';
import { HttpTokenInterceptor } from './interceptors/http-token-interceptor';
import { LedgerComponent } from './ledger/ledger.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LedgerComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    CookieService,
    AuthGuard,
    AuthService,
    LedgerService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
