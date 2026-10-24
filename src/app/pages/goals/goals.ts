import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GoalService, Goal } from '../../services/goal.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { CurrencyFormatPipe } from '../../shared/currency.pipe';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ProgressBarModule,
    CurrencyFormatPipe
  ],
  templateUrl: './goals.html',
  styleUrls: ['./goals.css']
})
export class GoalsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private goalService = inject(GoalService);

  goals: Goal[] = [];
  userId: string = '';
  completedGoals = 0;
  totalSaved = 0;

  form = this.fb.group({
    name: ['', Validators.required],
    targetAmount: [0, [Validators.required, Validators.min(0.01)]],
    currentAmount: [0, Validators.min(0)],
    targetDate: [new Date().toISOString().split('T')[0], Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadGoals();
      }
    });
  }

  loadGoals() {
    this.goalService.getGoals(this.userId).subscribe(data => {
      this.goals = data;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.completedGoals = this.goals.filter(g => g.currentAmount >= g.targetAmount).length;
    this.totalSaved = this.goals.reduce((sum, g) => sum + g.currentAmount, 0);
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    const goal: Goal = {
      name: formValue.name!,
      targetAmount: formValue.targetAmount!,
      currentAmount: formValue.currentAmount || 0,
      targetDate: new Date(formValue.targetDate!),
      description: formValue.description || ''
    };
    try {
      await this.goalService.addGoal(this.userId, goal);
      this.form.reset({ targetDate: new Date().toISOString().split('T')[0] });
      this.loadGoals();
    } catch (err) {
      console.error('Error adding goal', err);
    }
  }

  async deleteGoal(id: string | undefined) {
    if (!id) return;
    const confirmed = window.confirm('Are you sure you want to delete this goal?');
    if (!confirmed) return;
    try {
      await this.goalService.deleteGoal(this.userId, id);
      this.loadGoals();
    } catch (err) {
      console.error('Error deleting goal', err);
    }
  }
}
