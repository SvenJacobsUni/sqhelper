import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { SqliteService } from '../services/sqlite.service';
import { StudentSiteComponent } from '../student-site/student-site.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTooltipModule, MatIconModule, StudentSiteComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent implements OnInit, OnDestroy {
  noDbDetected = false;
  private subscription: Subscription | null = null;

  constructor(
    public router: Router,
    private sqliteService: SqliteService
  ) { }

  ngOnInit(): void {
    this.subscription = this.sqliteService.noDbError$.subscribe(() => {
      this.noDbDetected = true;
    });
  }

  toHome(): void {
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
