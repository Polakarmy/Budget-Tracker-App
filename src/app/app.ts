import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { routes } from './app.routes';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <main [class.with-sidebar]="showNavbar">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main.with-sidebar {
      margin-left: 250px;
      transition: margin-left 0.3s;
    }
  `]
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  showNavbar = false;

  ngOnInit() {
    
    this.showNavbar = !this.router.url.includes('login') && !this.router.url.includes('register');
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = !event.url.includes('login') && !event.url.includes('register');
    });
  }
}
