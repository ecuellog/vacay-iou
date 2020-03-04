
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './services/guards/auth-guard.service';
import { AuthService } from './services/auth.service';
import { LedgerService } from './services/ledger.service';
import { UserService } from './services/user.service';
import { HttpTokenInterceptor } from './interceptors/http-token-interceptor';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LedgerComponent } from './components/ledger/ledger.component';
import { TabsComponent } from './views/tabs/tabs.component';
import { NavSideDashboardComponent } from './components/nav-side-dashboard/nav-side-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LedgerComponent,
    RegisterComponent,
    TabsComponent,
    NavSideDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
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
