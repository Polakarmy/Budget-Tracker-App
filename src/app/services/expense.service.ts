import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Expense {
  id?: string;
  title?: string;
  category: string;
  amount: number;
  date: Date;
  description: string;
  type?: 'expense';
  recurring?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private data = inject(DataService);

  getExpenses(userId: string): Observable<Expense[]> {
    return this.data.getCollection<Expense>(userId, 'expenses').pipe(
      map(expenses => expenses.map(exp => ({ ...exp, date: (exp.date as any).toDate() })))
    );
  }

  addExpense(userId: string, expense: Expense) {
    return this.data.addDocument(userId, 'expenses', expense);
  }

  updateExpense(userId: string, id: string, expense: Partial<Expense>) {
    return this.data.updateDocument(userId, 'expenses', id, expense);
  }

  deleteExpense(userId: string, id: string) {
    return this.data.deleteDocument(userId, 'expenses', id);
  }
}