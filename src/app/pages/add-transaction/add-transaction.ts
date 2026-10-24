import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ExpenseService, Expense } from '../../services/expense.service';
import { IncomeService, Income } from '../../services/income.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule
  ],
  templateUrl: './add-transaction.html',
  styleUrls: ['./add-transaction.css']
})
export class AddTransactionComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private expenseService = inject(ExpenseService);
  private incomeService = inject(IncomeService);
  private router = inject(Router);

  userId: string = '';
  loading = false;

  form = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    type: ['expense', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    recurring: [false]
  });

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const formValue = this.form.value;
    const transaction = {
      title: formValue.title,
      category: formValue.category,
      amount: formValue.amount,
      date: new Date(formValue.date!),
      description: '',
      recurring: formValue.recurring
    };

    try {
      if (formValue.type === 'expense') {
        await this.expenseService.addExpense(this.userId, transaction as Expense);
      } else {
        await this.incomeService.addIncome(this.userId, {
          source: transaction.category,
          ...transaction
        } as Income);
      }
      this.form.reset({ date: new Date().toISOString().split('T')[0], type: 'expense', recurring: false });
      this.router.navigate(['/expenses']);
    } catch (err) {
      console.error('Error adding transaction', err);
    } finally {
      this.loading = false;
    }
  }
}