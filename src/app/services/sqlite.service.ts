import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import initSqlJs, { Database, SqlJsStatic } from 'sql.js/dist/sql-wasm';

export interface SchemaItem {
  table_name: string;
  column_name: string;
  column_type: string;
  column_key: string;
}

export interface ForeignKey {
  table_name: string;
  column_name: string;
  referenced_table_name: string;
  referenced_column_name: string;
}

export interface SchemaInfo {
  items: SchemaItem[];
  keys: ForeignKey[];
}

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;
  private initPromise: Promise<void> | null = null;

  // Observables
  private resultSubject = new Subject<any[]>();
  private errorSubject = new Subject<{ Nachricht: string; Nummer: number }>();
  private schemaSubject = new BehaviorSubject<SchemaInfo | null>(null);
  private dbDetectedSubject = new BehaviorSubject<boolean>(false);
  private uploadDoneSubject = new Subject<void>();
  private uploadErrorSubject = new Subject<string>();
  private noDbErrorSubject = new Subject<any>();
  private initDoneSubject = new BehaviorSubject<boolean>(false);

  // Public Observables
  public result$ = this.resultSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public schema$ = this.schemaSubject.asObservable();
  public dbDetected$ = this.dbDetectedSubject.asObservable();
  public uploadDone$ = this.uploadDoneSubject.asObservable();
  public uploadError$ = this.uploadErrorSubject.asObservable();
  public noDbError$ = this.noDbErrorSubject.asObservable();
  public initDone$ = this.initDoneSubject.asObservable();

  constructor() {
    this.initPromise = this.initSqlJs();
  }

  private async initSqlJs(): Promise<void> {
    try {
      this.SQL = await initSqlJs({
        locateFile: (file: string) => `assets/sql-wasm/${file}`
      });
      this.initDoneSubject.next(true);
    } catch (error) {
      console.error('Failed to initialize SQL.js:', error);
      this.initDoneSubject.next(true); // Still mark as done so UI isn't stuck
    }
  }

  async waitForInit(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  async loadDemoDatabase(): Promise<void> {
    if (!this.SQL) {
      await this.waitForInit();
    }

    try {
      this.db = new this.SQL!.Database();

      const response = await fetch('assets/Demo-sqlite.sql');
      const sqlContent = await response.text();

      this.db.run(sqlContent);

      this.dbDetectedSubject.next(true);
      this.getSchema();
    } catch (error) {
      console.error('Failed to load demo database:', error);
      this.noDbErrorSubject.next({ errno: 1049 });
      this.dbDetectedSubject.next(false);
    }
  }

  async loadFile(file: File): Promise<void> {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.sqlite') || fileName.endsWith('.db') || fileName.endsWith('.sqlite3')) {
      await this.loadSqliteFile(file);
    } 
    else {
      this.uploadErrorSubject.next('Bitte waehlen Sie eine .sqlite Datei aus');
    }
  }

  async loadSqliteFile(file: File): Promise<void> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);

      if (!this.SQL) {
        await this.waitForInit();
      }

      this.db = new this.SQL!.Database(new Uint8Array(arrayBuffer));

      this.dbDetectedSubject.next(true);
      this.getSchema();
      this.uploadDoneSubject.next();
    } catch (error) {
      console.error('Failed to load SQLite file:', error);
      this.uploadErrorSubject.next((error as Error).message || 'Fehler beim Laden der SQLite-Datei');
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  executeQuery(sql: string): void {
    if (!this.db) {
      this.errorSubject.next({
        Nachricht: 'Keine Datenbank geladen',
        Nummer: 1049
      });
      return;
    }

    try {
      const results = this.db.exec(sql);

      if (results.length === 0) {
        this.resultSubject.next([[{ leere: 'leere', Tabelle: 'Tabelle' }]]);
      } else {
        const columns = results[0].columns;
        const rows = results[0].values.map((row: any[]) => {
          const obj: Record<string, any> = {};
          columns.forEach((col: string, idx: number) => {
            obj[col] = row[idx];
          });
          return obj;
        });

        this.resultSubject.next([rows]);
      }
    } catch (error) {
      this.errorSubject.next({
        Nachricht: (error as Error).message || 'SQL Fehler',
        Nummer: 0
      });
    }
  }

  getSchema(): void {
    if (!this.db) {
      this.noDbErrorSubject.next({ errno: 1049 });
      return;
    }

    const items: SchemaItem[] = [];
    const keys: ForeignKey[] = [];

    try {
      const tablesResult = this.db.exec(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );

      if (tablesResult.length === 0) {
        this.schemaSubject.next({ items: [], keys: [] });
        return;
      }

      const tableNames = tablesResult[0].values.map((row: any[]) => row[0] as string);

      for (const tableName of tableNames) {
        const columnsResult = this.db.exec(`PRAGMA table_info("${tableName}")`);

        if (columnsResult.length > 0) {
          for (const colRow of columnsResult[0].values) {
            items.push({
              table_name: tableName,
              column_name: colRow[1] as string,
              column_type: colRow[2] as string,
              column_key: (colRow[5] as number) > 0 ? 'PRI' : ''
            });
          }
        }

        const fkResult = this.db.exec(`PRAGMA foreign_key_list("${tableName}")`);

        if (fkResult.length > 0) {
          for (const fkRow of fkResult[0].values) {
            keys.push({
              table_name: tableName,
              column_name: fkRow[3] as string,
              referenced_table_name: fkRow[2] as string,
              referenced_column_name: fkRow[4] as string
            });
          }
        }
      }

      this.schemaSubject.next({ items, keys });
    } catch (error) {
      console.error('Failed to get schema:', error);
      this.noDbErrorSubject.next(error);
    }
  }

  checkDbDetected(): void {
    if (!this.db) {
      this.dbDetectedSubject.next(false);
      return;
    }

    try {
      const result = this.db.exec(
        "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );
      const tableCount = (result[0]?.values[0]?.[0] as number) || 0;
      this.dbDetectedSubject.next(tableCount > 0);
    } catch {
      this.dbDetectedSubject.next(false);
    }
  }
}
