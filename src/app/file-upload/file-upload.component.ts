import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  name = '';
  uploadPercent = 0;
  isUploading = false;
  isDragOver = false;

  color: 'primary' | 'accent' | 'warn' = 'primary';
  mode: 'determinate' | 'indeterminate' = 'determinate';

  private uploadDoneSub: Subscription | null = null;
  private uploadErrorSub: Subscription | null = null;

  constructor(
    private sqliteService: SqliteService,
    public router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.uploadDoneSub = this.sqliteService.uploadDone$.subscribe(() => {
      this.uploadPercent = 100;
      this.isUploading = false;
    });

    this.uploadErrorSub = this.sqliteService.uploadError$.subscribe((error: string) => {
      this.isUploading = false;
      this.uploadPercent = 0;
      this.snackBar.open(error, 'OK', { duration: 5000, panelClass: ['mat-toolbar', 'mat-warn'] });
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.name = this.selectedFile.name;
      this.upload();
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.name = this.selectedFile.name;
      this.upload();
    }
  }

  async upload(): Promise<void> {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadPercent = 50;

    await this.sqliteService.loadFile(this.selectedFile);
  }

  ngOnDestroy(): void {
    this.uploadDoneSub?.unsubscribe();
    this.uploadErrorSub?.unsubscribe();
  }
}
