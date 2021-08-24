import { Component,OnInit, Output, EventEmitter} from '@angular/core';
import {WebSocketService} from '../web-socket.service';

@Component({
  selector: 'app-db-text',
  templateUrl: './db-text.component.html',
  styleUrls: ['./db-text.component.css']
})
export class DbTextComponent implements OnInit {
@Output() TableName = new EventEmitter(); // wird an student-site gesendet, um Tabellenname als Überschrift anzuzeigen

allsql; // alle Attribute und Primary Keys aller Tabellen einer Datenbank als Array mit JSON Objekten
allkeys; // alle Foreign Keys aller Tabellen einer Datenbank als Array mit JSON Objekten
alltables = [{table:"", attri: []}]; // Verschachteltes Array / JSON, welches gefüllt wird für die Anzeige auf der html
subscriptionsendermjson;
constructor (private webSocketService: WebSocketService) {}

openTable(table)
{
  this.webSocketService.emit('get-schueler-table', "Select * from "+table+""); // Funktion für die Buttons um die jeweilige Tabelle anzuzeigen
  this.TableName.emit(table)
}

ngOnInit ()
{
// this.webSocketService.emit('get-erm-json', {}) wird schon in anderer db component aufgerufen

 /// Wenn Tabellen Schema kommt (siehe SocketServer\student-site\DBDiagramm.js):
this.subscriptionsendermjson=this.webSocketService.listen('send-erm-json').subscribe((x:any)=>{
this.alltables = [{table:"", attri: [""]}];
this.allsql= x.items; // alle Attribute und Primary Keys aller Tabellen einer Datenbank als Array mit JSON Objekten
this.allkeys = x.keys; // alle Foreign Keys aller Tabellen einer Datenbank als Array mit JSON Objekten
var inside = []; // tabellennamen werden hier reingepusht, um zu verhindern, dass eine Tabelle doppelt erstellt wird
var tablecount = 0; // -> Gesamtanzahl der Tabellenm

  // Einfügen aller Tabellen und Attribute
  for (var i = 0 ; i < this.allsql.length; i++) // komplettes JSON Array durchlaufen
    {
    if (!inside.includes(this.allsql[i].table_name)) // wenn tabellename noch nicht vorkam: neus JSON in Array pushen mit Tabellenname und Array mit Attributen
        {
          tablecount ++;
          var attributmitryp =this.allsql[i].column_name+",";
          if (this.allsql[i].column_key == "PRI") {attributmitryp = '<u>'+attributmitryp+ '</u>' } // Wenn Primarykey, dann unterstreichen
          if (this.allsql[i+1] != null)
          {
            if (!inside.includes(this.allsql[i+1].table_name)) {attributmitryp.slice(0, -1) + ')';} // wenn letzte Attribut einer Tabelle kein Komma sondern )
          }
          this.alltables.push({table: this.allsql[i].table_name, attri: [attributmitryp]})
          inside.push(this.allsql[i].table_name); // Tabellenname in ein Array. Zur Überprüfung, ob Tabellename schon vorkam bzw, ob neue Parentcell gebaut werden muss
        }
    else // wenn Tabellenname schon vorkam -> Attribut ins gleiche Objekt des Arrays packen
        {
          var attributmitryp = this.allsql[i].column_name+",";
          if (this.allsql[i].column_key == "PRI") {attributmitryp = '<u>'+attributmitryp+"</u>"} // Wenn Primarykey, dann unterstreichen
          if (this.allsql[i+1] != null)
          {
            if (!inside.includes(this.allsql[i+1].table_name)) // wenn nächstes Element eine neue Tabelle erstellen würde
               {
                 attributmitryp= attributmitryp.slice(0, -1) + ')'; // dann hänge ) dran
               }
          }
          if (this.allsql[i+1] == null)
          {
            attributmitryp= attributmitryp.slice(0, -1) + ')'; // letztes Attribut der letzten Tabelle extra um hinten Klammer anzufügen
          }
          this.alltables[tablecount].attri.push(attributmitryp)
        }
    }
         this.alltables.shift(); // erstes leeres Ele entfernen

  /// Alle foreign Keys mit ↑ anzeigen
  for (var t = 0 ; t < this.allsql.length; t++) //alle Attribute durchlaufen
  {
    for (var k = 0 ; k < this.allkeys.length; k++) // alle foreign Keys durchlaufen
    {
      if (this.allsql[t].column_name == this.allkeys[k].column_name && this.allsql[t].table_name==this.allkeys[k].table_name) // wenn Tabellen und Attributname gleich
       {
        for (var u = 0 ; u < this.alltables.length; u++) // das oben generierte Array durchlaufen
        {
          if (this.alltables[u].table == this.allsql[t].table_name) // wenn der gleiche table
          {
            for (var m = 0 ; m < this.alltables[u].attri.length; m++) // alle attribute des Tables durchlaufen
            {

              if (this.alltables[u].attri[m].substring(0,this.alltables[u].attri[m].length - 1)==this.allkeys[k].column_name ||this.alltables[u].attri[m].substring(0,this.alltables[u].attri[m].length - 1)=="<u>"+this.allkeys[k].column_name+",</u") // wenn attribut gleich ist (letzter char weg wegen komma oder Klammer)
              {
                this.alltables[u].attri[m] = "↑" + this.alltables[u].attri[m] // sonst als erstes Element
              }
            }
          }
        }
    }
  }
}
}) // Ende webSocketService.listen('send-erm-json')
} // Ende OnInit
ngOnDestroy ()
  { // socket subscriptions wieder unsubsciben um memory-leak zu verhinden (bei vielen subs kann man die sicherlich in ein array pushen und mit ner schleife unsubben)
    this.subscriptionsendermjson.unsubscribe()
  }
}
