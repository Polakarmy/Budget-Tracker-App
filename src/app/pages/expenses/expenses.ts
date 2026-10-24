import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ExpenseService, Expense } from '../../services/expense.service';
import { IncomeService, Income } from '../../services/income.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';

interface Transaction {
  id?: string;
  title?: string;
  category?: string;
  source?: string;
  amount: number;
  date: Date;
  description?: string;
  type: 'expense' | 'income';
  displayTitle: string;
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    RouterModule
  ],
  templateUrl: './expenses.html',
  styleUrls: ['./expenses.css']
})
export class ExpensesComponent implements OnInit {
  private auth = inject(AuthService);
  private expenseService = inject(ExpenseService);
  private incomeService = inject(IncomeService);

  expenses: Expense[] = [];
  incomes: Income[] = [];
  userId: string = '';
  filterType: 'all' | 'income' | 'expense' = 'all';
  searchTerm = '';
  filteredTransactions: Transaction[] = [];

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadExpenses();
        this.loadIncomes();
      }
    });
  }

  loadExpenses() {
    this.expenseService.getExpenses(this.userId).subscribe(data => {
      this.expenses = data;
      this.updateFilteredTransactions();
    });
  }

  loadIncomes() {
    this.incomeService.getIncomes(this.userId).subscribe(data => {
      this.incomes = data;
      this.updateFilteredTransactions();
    });
  }

  updateFilteredTransactions() {
    const allTransactions: Transaction[] = [
      ...this.expenses.map(e => ({ ...e, type: 'expense' as const, displayTitle: e.title || e.category })),
      ...this.incomes.map(i => ({ ...i, type: 'income' as const, displayTitle: i.title || i.source }))
    ];

    this.filteredTransactions = allTransactions.filter(transaction => {
      const matchesType = this.filterType === 'all' || transaction.type === this.filterType;
      const matchesSearch = this.searchTerm === '' ||
        (transaction.displayTitle || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (transaction.category || transaction.source || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (transaction.description || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }

  async deleteTransaction(transaction: Transaction) {
    if (!transaction.id) return;
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirmed) return;
    try {
      if (transaction.type === 'expense') {
        await this.expenseService.deleteExpense(this.userId, transaction.id!);
        this.loadExpenses();
      } else {
        await this.incomeService.deleteIncome(this.userId, transaction.id!);
        this.loadIncomes();
      }
    } catch (err) {
      console.error('Failed to delete transaction', err);
    }
  }

  onSearch() {
    this.updateFilteredTransactions();
  }

  setFilterType(type: 'all' | 'income' | 'expense') {
    this.filterType = type;
    this.updateFilteredTransactions();
  }
}
