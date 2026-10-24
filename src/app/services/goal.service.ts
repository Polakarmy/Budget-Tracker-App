import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Goal {
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class GoalService {
  private data = inject(DataService);

  getGoals(userId: string): Observable<Goal[]> {
    return this.data.getCollection<Goal>(userId, 'goals').pipe(
      map(goals => goals.map(g => ({ ...g, targetDate: (g.targetDate as any)?.toDate() })))
    );
  }

  addGoal(userId: string, goal: Goal) {
    return this.data.addDocument(userId, 'goals', goal);
  }

  updateGoal(userId: string, id: string, goal: Partial<Goal>) {
    return this.data.updateDocument(userId, 'goals', id, goal);
  }

  deleteGoal(userId: string, id: string) {
    return this.data.deleteDocument(userId, 'goals', id);
  }
}