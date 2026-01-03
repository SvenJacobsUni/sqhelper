import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SqliteService } from './services/sqlite.service';
import { ImpressumComponent } from './dialogs/impressum.component';
import { DatenschutzComponent } from './dialogs/datenschutz.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(
    private titleService: Title,
    private sqliteService: SqliteService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('SQheLper');
  }

  openImpressum(): void {
    this.dialog.open(ImpressumComponent);
  }

  openDatenschutz(): void {
    this.dialog.open(DatenschutzComponent);
  }
}
