import { Injectable, inject } from '@angular/core';
import { ExpenseService, Expense } from './expense.service';
import { IncomeService, Income } from './income.service';
import { BudgetService, Budget } from './budget.service';
import { GoalService, Goal } from './goal.service';
import { Observable, combineLatest, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private expenseService = inject(ExpenseService);
  private incomeService = inject(IncomeService);
  private budgetService = inject(BudgetService);
  private goalService = inject(GoalService);

  getIncomeVsExpenses(userId: string): Observable<{ totalIncome: number; totalExpenses: number; net: number }> {
    return combineLatest([
      this.incomeService.getIncomes(userId),
      this.expenseService.getExpenses(userId)
    ]).pipe(
      map(([incomes, expenses]) => {
        const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
      })
    );
  }

  getBudgetVariance(userId: string): Observable<{ category: string; limit: number; spent: number; variance: number }[]> {
    return this.budgetService.getBudgets(userId).pipe(
      map(budgets => budgets.map(b => ({
        category: b.category,
        limit: b.limit,
        spent: b.spent || 0,
        variance: b.limit - (b.spent || 0)
      })))
    );
  }

  getSavingsProgress(userId: string): Observable<{ name: string; progress: number; target: number; current: number }[]> {
    return this.goalService.getGoals(userId).pipe(
      map(goals => goals.map(g => ({
        name: g.name,
        progress: (g.currentAmount / g.targetAmount) * 100,
        target: g.targetAmount,
        current: g.currentAmount
      })))
    );
  }
}