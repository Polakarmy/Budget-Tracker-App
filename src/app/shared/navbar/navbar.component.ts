import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <h2>BudgetTracker</h2>
      </div>
      <hr class="sidebar-separator">
      <ul class="sidebar-menu">
        <li><a routerLink="/dashboard" routerLinkActive="active"><i class="pi pi-home"></i> Dashboard</a></li>
        <li><a routerLink="/expenses" routerLinkActive="active"><i class="pi pi-minus-circle"></i> Transactions</a></li>
        <li><a routerLink="/add-transaction" routerLinkActive="active"><i class="pi pi-plus"></i> Add Transaction</a></li>
        <li><a routerLink="/income" routerLinkActive="active"><i class="pi pi-plus-circle"></i> Income</a></li>
        <li><a routerLink="/budgets" routerLinkActive="active"><i class="pi pi-wallet"></i> Budgets</a></li>
        <li><a routerLink="/goals" routerLinkActive="active"><i class="pi pi-bullseye"></i> Goals</a></li>
        <li><a routerLink="/reports" routerLinkActive="active"><i class="pi pi-chart-line"></i> Reports</a></li>
      </ul>
      <hr class="sidebar-separator">
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()"><i class="pi pi-sign-out"></i> Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 250px;
      background: white;
      color: black;
      padding: 16px;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    .sidebar-header {
      padding: 0 0 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .sidebar-separator {
      border: none;
      border-top: 1px solid #ddd;
      margin: 8px 16px;
    }
    .sidebar-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: black;
    }
    .sidebar-menu {
      list-style: none;
      padding: 16px 0;
      margin: 0;
    }
    .sidebar-menu li {
      margin: 0;
    }
    .sidebar-menu a {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 16px;
      color: black;
      text-decoration: none;
      transition: background 0.3s;
      border-radius: 8px;
    }
    .sidebar-menu a.active {
      background: #45a049;
      color: white;
    }
    .sidebar-menu i {
      font-size: 1.2rem;
    }
    .sidebar-footer {
      position: absolute;
      bottom: 16px;
      left: 0;
      right: 0;
      padding: 0 16px;
    }
    .logout-btn {
      width: 100%;
      padding: 16px;
      background: #2196f3;
      color: #ffffff;
      border: 1px solid #1976d2;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.15s;
    }
    .logout-btn:hover {
      background: #4caf50;
    }
  `]
})
export class NavbarComponent {
  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}