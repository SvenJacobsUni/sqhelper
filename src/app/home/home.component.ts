import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { SqliteService } from '../services/sqlite.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, FileUploadComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  showUpload = false;
  sqlReady = false;
  isLoadingExample = false;

  constructor(
    private sqliteService: SqliteService,
    public router: Router
  ) { }

  ngOnInit(): void {
    const uploadSub = this.sqliteService.uploadDone$.subscribe(() => {
      this.router.navigate(['/start']);
    });
    this.subscriptions.push(uploadSub);

    const initSub = this.sqliteService.initDone$.subscribe(done => {
      this.sqlReady = done;
    });
    this.subscriptions.push(initSub);
  }

  showUploadSection(): void {
    this.showUpload = true;
  }

  hideUploadSection(): void {
    this.showUpload = false;
  }

  async loadExampleDb(): Promise<void> {
    if (this.isLoadingExample) return;
    this.isLoadingExample = true;
    await this.sqliteService.loadDemoDatabase();
    this.router.navigate(['/start']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
