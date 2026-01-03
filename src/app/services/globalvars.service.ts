import { Injectable, signal } from '@angular/core';
import { SqliteService, SchemaInfo } from './sqlite.service';

// Blockly MenuOption type: [label, value]
type MenuOption = [string, string];

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  // Signals for reactive updates
  private _tables = signal<MenuOption[]>([['', '']]);
  private _attributes = signal<MenuOption[]>([['*', '*']]);
  private _ready = signal<boolean>(false);

  // Public readonly signals
  readonly tables = this._tables.asReadonly();
  readonly attributes = this._attributes.asReadonly();
  readonly ready = this._ready.asReadonly();

  // For backwards compatibility with Blockly blocks (global access)
  static Table: MenuOption[] = [['', '']];
  static Attribut: MenuOption[] = [['*', '*']];
  static ready: boolean = false;

  constructor(private sqliteService: SqliteService) {
    this.sqliteService.schema$.subscribe(schema => {
      if (schema) {
        this.updateFromSchema(schema);
      }
    });
  }

  private updateFromSchema(schema: SchemaInfo): void {
    const tableSet = new Set<string>();
    const attributeList: MenuOption[] = [['*', '*']];

    for (const item of schema.items) {
      tableSet.add(item.table_name);

      const displayName = `${item.table_name}.${item.column_name}`;
      attributeList.push([displayName, displayName]);
    }

    const tableList: MenuOption[] = [['', '']];
    for (const tableName of tableSet) {
      tableList.push([tableName, tableName]);
    }

    // Update signals
    this._tables.set(tableList);
    this._attributes.set(attributeList);
    this._ready.set(true);

    // Update static values for Blockly blocks
    GlobalVarsService.Table = tableList;
    GlobalVarsService.Attribut = attributeList;
    GlobalVarsService.ready = true;
  }
}

// Global reference for Blockly blocks (legacy compatibility)
export const globalvars = {
  get Table(): MenuOption[] { return GlobalVarsService.Table; },
  get Attribut(): MenuOption[] { return GlobalVarsService.Attribut; },
  get ready() { return GlobalVarsService.ready; }
};
