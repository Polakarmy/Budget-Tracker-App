import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { AuthService } from '../../services/auth.service';

interface IncomeExpenseReport {
  totalIncome: number;
  totalExpenses: number;
  net: number;
}

interface BudgetVariance {
  category: string;
  limit: number;
  spent: number;
  variance: number;
}

interface SavingsProgress {
  name: string;
  progress: number;
  target: number;
  current: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  private authService = inject(AuthService);

  incomeExpenseReport: IncomeExpenseReport | null = null;
  budgetVariances: BudgetVariance[] = [];
  savingsProgress: SavingsProgress[] = [];

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadReports(user.uid);
      }
    });
  }

  private loadReports(userId: string) {
    this.reportService.getIncomeVsExpenses(userId).subscribe(report => {
      this.incomeExpenseReport = report;
    });

    this.reportService.getBudgetVariance(userId).subscribe(variances => {
      this.budgetVariances = variances;
    });

    this.reportService.getSavingsProgress(userId).subscribe(progress => {
      this.savingsProgress = progress;
    });
  }
}