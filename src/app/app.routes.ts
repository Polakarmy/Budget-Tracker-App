import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ExpensesComponent } from './pages/expenses/expenses';
import { IncomeComponent } from './pages/income/income';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { AuthGuard } from './auth/auth.guard';
import { BudgetsComponent } from './pages/budgets/budgets';
import { GoalsComponent } from './pages/goals/goals';
import { ReportsComponent } from './pages/reports/reports';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
  { path: 'add-transaction', component: AddTransactionComponent, canActivate: [AuthGuard] },
  { path: 'income', component: IncomeComponent, canActivate: [AuthGuard] },
  { path: 'budgets', component: BudgetsComponent, canActivate: [AuthGuard] },
  { path: 'goals', component: GoalsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] }
];
