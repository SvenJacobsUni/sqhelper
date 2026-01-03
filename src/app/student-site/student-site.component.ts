import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AngularSplitModule } from 'angular-split';
import { Subscription } from 'rxjs';
import { format } from 'sql-formatter';
import { SqliteService } from '../services/sqlite.service';
import { TableComponent } from '../table/table.component';
import { DbTextComponent } from '../db-text/db-text.component';
import { DbDiagramComponent } from '../db-diagram/db-diagram.component';
import { BlocklyComponent } from '../blockly/blockly.component';

@Component({
  selector: 'app-student-site',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    AngularSplitModule,
    TableComponent,
    DbTextComponent,
    DbDiagramComponent,
    BlocklyComponent
  ],
  templateUrl: './student-site.component.html',
  styleUrl: './student-site.component.scss'
})
export class StudentSiteComponent implements OnInit, OnDestroy, AfterViewInit {
  dataMessageResults: any[] = [];
  Titel = 'Ergebnisse';
  viewMode: 'visual' | 'text' = 'visual';
  blocklyEnabled = false;
  blockyCode = '';
  formattedSQL = '';
  sqlError: { Nachricht: string; Nummer: number } | null = null;
  isDesktop = true;

  private resultSub: Subscription | null = null;
  private errorSub: Subscription | null = null;
  private breakpointSub: Subscription | null = null;

  constructor(
    private sqliteService: SqliteService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointSub = this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .subscribe(result => {
        this.isDesktop = result.matches;
      });
  }

  @ViewChild(BlocklyComponent) blocklyComponent!: BlocklyComponent;

  onSplitDragEnd(): void {
    if (this.blocklyComponent) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        this.blocklyComponent.onResize();
      }, 50);
    }
  }


  updateBlocklyCode(code: string): void {
    this.formattedSQL = format(code, {
      language: 'sql',
      tabWidth: 2
    });
    this.blockyCode = code;
  }

  enableBlockly(): void {
    this.blocklyEnabled = true;
  }

  updateTableName(tableName: string): void {
    this.Titel = tableName;
  }

  getHeaders(): { col: string[]; data: any[] } {
    const headers: string[] = [];
    if (this.dataMessageResults.length > 0) {
      this.dataMessageResults.forEach((value) => {
        Object.keys(value).forEach((key) => {
          if (!headers.includes(key)) {
            headers.push(key);
          }
        });
      });
    }
    return { col: headers, data: this.dataMessageResults };
  }

  runSql(): void {
    this.sqliteService.executeQuery(this.blockyCode);
    this.Titel = 'Query Result';
  }

  ngOnInit(): void {
    this.resultSub = this.sqliteService.result$.subscribe((res: any) => {
      if (res[0] && res[0].length > 0) {
        this.dataMessageResults = res[0];
      } else {
        this.dataMessageResults = [];
      }
      this.sqlError = null;
    });

    this.errorSub = this.sqliteService.error$.subscribe((res) => {
      this.sqlError = res;
      this.dataMessageResults = []; // Clear previous results on error
    });
  }

  ngAfterViewInit(): void {
    // Trigger initial resize to ensure Blockly fits the container
    // Needs a longer delay to allow angular-split to initialize fully
    setTimeout(() => {
      this.onSplitDragEnd();
    }, 500);
  }

  ngOnDestroy(): void {
    this.resultSub?.unsubscribe();
    this.errorSub?.unsubscribe();
    this.breakpointSub?.unsubscribe();
  }
}
