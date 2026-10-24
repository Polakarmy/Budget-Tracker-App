import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ReportService } from '../../services/report.service';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/income.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseChartDirective } from 'ng2-charts';
import 'chart.js/auto';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private report = inject(ReportService);
  private expenseService = inject(ExpenseService);
  private incomeService = inject(IncomeService);
  private router = inject(Router);

  user: any;
  loading = true;
  totalExpenses = 0;
  totalIncome = 0;
  totalBalance = 0;

  expenseCategories: { name: string, value: number, color: string }[] = [];

  colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];

  expenseChartData: any;
  expenseChartOptions: any = { 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value: number, ctx: any) => {
          const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
          return total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '';
        },
        color: '#fff',
        font: {
          weight: 'bold'
        }
      }
    }
  };

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loading = false;
        this.loadData(user.uid);
      }
    });
    this.updateCharts(); // Initialize chart with empty data
  }

  loadData(userId: string) {
    this.expenseService.getExpenses(userId).subscribe(expenses => {
      const expenseMap = new Map<string, number>();
      expenses.forEach(expense => {
        const category = expense.category || 'Other';
        expenseMap.set(category, (expenseMap.get(category) || 0) + expense.amount);
      });
      this.expenseCategories = Array.from(expenseMap.entries()).map(([name, value], index) => ({
        name,
        value,
        color: this.colors[index % this.colors.length]
      }));
      this.totalExpenses = this.expenseCategories.reduce((sum, cat) => sum + cat.value, 0);
      this.updateCharts();
      this.calculateBalance();
    });

    this.incomeService.getIncomes(userId).subscribe(incomes => {
      this.totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
      this.calculateBalance();
    });
  }

  updateCharts() {
    this.expenseChartData = {
      labels: this.expenseCategories.map(c => c.name),
      datasets: [{
        data: this.expenseCategories.map(c => c.value),
        backgroundColor: this.expenseCategories.map(c => c.color)
      }]
    };
  }

  calculateBalance() {
    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  navigateToAddExpense() {
    this.router.navigate(['/expenses']);
  }

  navigateToAddIncome() {
    this.router.navigate(['/income']);
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
