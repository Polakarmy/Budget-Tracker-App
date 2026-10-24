import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BudgetService, Budget } from '../../services/budget.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule
  ],
  templateUrl: './budgets.html',
  styleUrls: ['./budgets.css']
})
export class BudgetsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private budgetService = inject(BudgetService);

  userId: string = '';
  loading = false;
  budgets: Budget[] = [];

  form = this.fb.group({
    category: ['', Validators.required],
    limit: [0, [Validators.required, Validators.min(0.01)]],
    description: [''],
    period: ['Monthly', Validators.required]
  });

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadBudgets();
      }
    });
  }

  loadBudgets() {
    this.budgetService.getBudgets(this.userId).subscribe(data => {
      this.budgets = data;
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const formValue = this.form.value;
    const budget: Budget = {
      category: formValue.category!,
      limit: formValue.limit!,
      description: formValue.description || '',
      period: formValue.period!,
      date: new Date()
    };

    try {
      await this.budgetService.addBudget(this.userId, budget);
      this.form.reset();
      this.loadBudgets();
    } catch (err) {
      console.error('Error adding budget', err);
    } finally {
      this.loading = false;
    }
  }

  async deleteBudget(id: string | undefined) {
    if (!id) return;
    const confirmed = window.confirm('Are you sure you want to delete this budget?');
    if (!confirmed) return;
    try {
      await this.budgetService.deleteBudget(this.userId, id);
      this.loadBudgets();
    } catch (err) {
      console.error('Error deleting budget', err);
    }
  }
}
