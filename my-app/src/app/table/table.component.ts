import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {

  tableDataSrc; //  data/sort/paginator werden hiermit ans html "übergeben"

  @Input('tableColumns') tableCols: string[]; // Beim Aufrufen der Komponente als Child Component werden die HRs und der Tableinhalt übergeben
  @Input() set tableData (tableData) // mit den übergeben der Variabeln kann direkt eine Funktion aufgerufen werden
  {
    this.tableDataSrc = new MatTableDataSource(tableData);
    this.tableDataSrc.sort = this.sort;
    this.tableDataSrc.paginator = this.paginator;
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort; // MatSord und MatPaginator sind bei Angular-Material dabei
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  onSearchInput(ev) { // für die Suchfunktion
    const searchTarget = ev.target.value;
    this.tableDataSrc.filter = searchTarget.trim().toLowerCase();
  }
}
