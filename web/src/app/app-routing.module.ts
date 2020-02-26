import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/guards/auth-guard.service';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LedgerComponent } from './components/ledger/ledger.component';
import { RegisterComponent } from './views/register/register.component';
import { TabsComponent } from './views/tabs/tabs.component';

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'dashboard/tabs', component: TabsComponent, canActivate: [AuthGuard]},
  { path: 'ledger/:id', component: LedgerComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
