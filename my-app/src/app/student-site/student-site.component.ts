import { WebSocketService } from '../web-socket.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import sqlFormatter from "sql-formatter";
@Component({
  selector: 'app-student-site',
  templateUrl: './student-site.component.html',
  styleUrls: ['./student-site.component.css'],
})
export class StudentSiteComponent implements OnInit {
  dataMessageResults = [];
  Titel = 'Tabellen';
  closeResult = '';
  public isCollapsed = true;
  Nachname = '';
  db = '';
  enablederd = true;
  blocklyenabled = false;
  goterror = false;
  hi = [];
  hi2 = [];
  currentcourseselector = 'Wähle zuerst eine Datenbank aus';
  AllTasksArray = [];
  Blockycode;
  formattedSQL;
  allCommands = [];
  repeatCommandsJSON = [];
  deleteCommandsJSON = [];
  sql_error;
  sub1;
  sub2;

  constructor(private webSocketService: WebSocketService) {}
  @ViewChild('row', { static: true }) row: ElementRef;

  updateBlocklycode($event) {
    this.formattedSQL = sqlFormatter.format($event, {
      language: "sql",
      indent: "     "
  });
    this.Blockycode = $event;
  }

  enableBlockly($event) { // Blockly SQL wird erst nach initialisierung der Diagramme initialisiert, damit das Importieren des Workspaces aus dem JWT funktioniert (sonst können Dropdown Optionen nicht geladen werden)
  this.blocklyenabled = true;
  }

  // Wenn eine Tabelle von den Diagramm Komponenten geöffnet wird, so soll der Tabellenname auch als Überschrift angezeigt werden (siehe auch Stelle wo DB Schemata als Child in student-site geladen werden)
  updateTableName($event) {
    this.Titel = 'Tabelle: ' + $event;
  }

  getHeaders() {
    let headers: string[] = [];
    let data: {}[] = this.dataMessageResults;
    if (this.dataMessageResults != []) {
      this.dataMessageResults.forEach((value) => {
        Object.keys(value).forEach((key) => {
          if (!headers.find((header) => header == key)) {
            headers.push(key);
          }
        });
      });
    }
    return { col: headers, data: data };
  }

  //////Holt den Befehl aus dem Text Feld nach dem Drücken des Knopfs
  runSql()
  {
    this.webSocketService.emit('get-schueler-table', this.Blockycode); // Ausführen des Befehls des Schülers und Anzeige des Ergebnisses
    this.Titel = 'Ausgabe: ' + this.Blockycode;
  }

  ngOnInit() {

    this.sub1 = this.webSocketService
      .listen('send-result')
      .subscribe((res: any) => {
        if (res[0].length > 0) {
          this.dataMessageResults = res[0];
        } else {
          this.dataMessageResults = [{ leere: 'leere', Tabelle: 'Tabelle' }];
        }
        this.isCollapsed = false; // wenn kein Fehler -> zeige Lösungstabelle an
        this.sql_error = null; // ehemalige Fehlermeldung löschen, da gültiges result
      });
    this.sub2 = this.webSocketService
      .listen('send-Error')
      .subscribe((res: any) => {
        this.sql_error = res;
      });
  }

  ngOnDestroy() {
    // socket subscriptions wieder unsubsciben um memory-leak zu verhinden (bei vielen subs kann man die sicherlich in ein array pushen und mit ner schleife unsubben)
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
