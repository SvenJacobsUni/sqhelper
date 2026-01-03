import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { SqliteService, SchemaInfo, SchemaItem, ForeignKey } from '../services/sqlite.service';

interface TableDisplay {
  table: string;
  attri: string[];
}

@Component({
  selector: 'app-db-text',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './db-text.component.html',
  styleUrl: './db-text.component.scss'
})
export class DbTextComponent implements OnInit, OnDestroy {
  @Output() TableName = new EventEmitter<string>();

  allsql: SchemaItem[] = [];
  allkeys: ForeignKey[] = [];
  alltables: TableDisplay[] = [];

  private subscription: Subscription | null = null;

  constructor(private sqliteService: SqliteService) { }

  openTable(table: string): void {
    this.sqliteService.executeQuery(`SELECT * FROM "${table}"`);
    this.TableName.emit(table);
  }

  ngOnInit(): void {
    this.subscription = this.sqliteService.schema$.subscribe((schema: SchemaInfo | null) => {
      if (!schema) return;

      this.alltables = [];
      this.allsql = schema.items;
      this.allkeys = schema.keys;

      const inside: string[] = [];
      let tablecount = 0;

      for (let i = 0; i < this.allsql.length; i++) {
        if (!inside.includes(this.allsql[i].table_name)) {
          tablecount++;
          let attributmittyp = this.allsql[i].column_name;
          if (this.allsql[i].column_key === 'PRI') {
            attributmittyp = '<u>' + attributmittyp + '</u>';
          }
          this.alltables.push({ table: this.allsql[i].table_name, attri: [attributmittyp] });
          inside.push(this.allsql[i].table_name);
        } else {
          let attributmittyp = this.allsql[i].column_name;
          if (this.allsql[i].column_key === 'PRI') {
            attributmittyp = '<u>' + attributmittyp + '</u>';
          }
          this.alltables[tablecount - 1].attri.push(attributmittyp);
        }
      }

      // Foreign Keys mit Pfeil markieren
      for (let t = 0; t < this.allsql.length; t++) {
        for (let k = 0; k < this.allkeys.length; k++) {
          if (this.allsql[t].column_name === this.allkeys[k].column_name &&
            this.allsql[t].table_name === this.allkeys[k].table_name) {
            for (let u = 0; u < this.alltables.length; u++) {
              if (this.alltables[u].table === this.allsql[t].table_name) {
                for (let m = 0; m < this.alltables[u].attri.length; m++) {
                  const attrName = this.alltables[u].attri[m];
                  if (attrName === this.allkeys[k].column_name ||
                    attrName === '<u>' + this.allkeys[k].column_name + '</u>') {
                    this.alltables[u].attri[m] = '↑' + this.alltables[u].attri[m];
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
