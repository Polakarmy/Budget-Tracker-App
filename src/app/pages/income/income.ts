import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IncomeService, Income } from '../../services/income.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule
  ],
  templateUrl: './income.html',
  styleUrls: ['./income.css']
})
export class IncomeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private incomeService = inject(IncomeService);

  incomes: Income[] = [];
  userId: string = '';

  incomeSources = [
    { name: 'Salary', value: 5000, color: '#10b981' },
    { name: 'Freelance', value: 2000, color: '#3b82f6' },
    { name: 'Investments', value: 1500, color: '#f59e0b' },
    { name: 'Other', value: 800, color: '#8b5cf6' },
  ];

  incomeChartData = {
    labels: this.incomeSources.map(src => src.name),
    datasets: [{
      data: this.incomeSources.map(src => src.value),
      backgroundColor: this.incomeSources.map(src => src.color),
      hoverBackgroundColor: this.incomeSources.map(src => src.color)
    }]
  };

  incomeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  form = this.fb.group({
    source: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    description: [''],
    recurring: [false]
  });

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadIncomes();
      }
    });
  }

  loadIncomes() {
    this.incomeService.getIncomes(this.userId).subscribe(data => {
      this.incomes = data;
      this.updateChartData();
    });
  }

  updateChartData() {
    const sourceTotals: { [key: string]: number } = {};
    this.incomes.forEach(income => {
      sourceTotals[income.source] = (sourceTotals[income.source] || 0) + income.amount;
    });

    this.incomeSources = Object.keys(sourceTotals).map((src, index) => ({
      name: src,
      value: sourceTotals[src],
      color: this.getColor(index)
    }));

    this.incomeChartData = {
      labels: this.incomeSources.map(src => src.name),
      datasets: [{
        data: this.incomeSources.map(src => src.value),
        backgroundColor: this.incomeSources.map(src => src.color),
        hoverBackgroundColor: this.incomeSources.map(src => src.color)
      }]
    };
  }

  getColor(index: number): string {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    return colors[index % colors.length];
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const income: Income = {
      ...this.form.value as any,
      date: new Date(this.form.value.date!)
    };
    try {
      await this.incomeService.addIncome(this.userId, income);
      this.form.reset({ date: new Date().toISOString().split('T')[0], recurring: false });
      this.loadIncomes();
    } catch (err) {
      console.error('Error adding income', err);
    }
  }

  async deleteIncome(id: string | undefined) {
    if (!id) return;
    const confirmed = window.confirm('Are you sure you want to delete this income?');
    if (!confirmed) return;
    try {
      await this.incomeService.deleteIncome(this.userId, id);
      this.loadIncomes();
    } catch (err) {
      console.error('Error deleting income', err);
    }
  }
}
