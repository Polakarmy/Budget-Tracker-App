import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Income {
  id?: string;
  title?: string;
  source: string;
  amount: number;
  date: Date;
  description?: string;
  type?: 'income';
}

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private data = inject(DataService);

  getIncomes(userId: string): Observable<Income[]> {
    return this.data.getCollection<Income>(userId, 'incomes').pipe(
      map(incomes => incomes.map(inc => ({ ...inc, date: (inc.date as any).toDate() })))
    );
  }

  addIncome(userId: string, income: Income) {
    return this.data.addDocument(userId, 'incomes', income);
  }

  updateIncome(userId: string, id: string, income: Partial<Income>) {
    return this.data.updateDocument(userId, 'incomes', id, income);
  }

  deleteIncome(userId: string, id: string) {
    return this.data.deleteDocument(userId, 'incomes', id);
  }
}