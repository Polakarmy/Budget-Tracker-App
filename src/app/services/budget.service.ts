import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Budget {
  id?: string;
  category: string;
  limit: number;
  spent?: number;
  period: string;
  description?: string;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private data = inject(DataService);

  getBudgets(userId: string): Observable<Budget[]> {
    return this.data.getCollection<Budget>(userId, 'budgets').pipe(
      map(budgets => budgets.map(b => ({ ...b, date: (b.date as any)?.toDate() })))
    );
  }

  addBudget(userId: string, budget: Budget) {
    return this.data.addDocument(userId, 'budgets', budget);
  }

  updateBudget(userId: string, id: string, budget: Partial<Budget>) {
    return this.data.updateDocument(userId, 'budgets', id, budget);
  }

  deleteBudget(userId: string, id: string) {
    return this.data.deleteDocument(userId, 'budgets', id);
  }
}