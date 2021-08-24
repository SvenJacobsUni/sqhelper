import { Component, ElementRef,OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {WebSocketService} from '../web-socket.service';
import { globalvars } from '../globalvars';

@Component({
  selector: 'app-db-diagram',
  templateUrl: './db-diagram.component.html',
  styleUrls: ['./db-diagram.component.css']
})
export class DBDiagramComponent implements OnInit {

@Output() TableName = new EventEmitter(); // wird an student-site gesendet, um Tabellenname als Überschrift anzuzeigen
allsql;
allkeys;
alltables;
subscriptionsendermjson;
@Output() enableBlockly = new EventEmitter(); // Blockly SQL wird erst nach initialisierung der Diagramme initialisiert, damit das Importieren des Workspaces aus dem JWT funktioniert (sonst können Dropdown Optionen nicht geladen werden)
 @ViewChild('graphContainer') graphContainer: ElementRef;
  constructor (private webSocketService: WebSocketService) {}

ngOnInit () {
    this.webSocketService.emit('get-erm-json', {})

    /// Wenn Tabllen Schema kommt:
this.subscriptionsendermjson = this.webSocketService.listen('send-erm-json').subscribe((x:any)=>{

  this.allsql= x.items; // alle Attribute und Primary Keys aller Tabellen einer Datenbank als Array mit JSON Objekten
  this.allkeys = x.keys; // alle Foreign Keys aller Tabellen einer Datenbank als Array mit JSON Objekten
  var inside = []; // tabellennamen werden hier reingepusht, um zu verhindern, dass eine Tabelle doppelt erstellt wird

///////////////////////////////////////////////////// ANFANG GRAPH
/////////////////////////////////////////////////////

this.graphContainer.nativeElement.style = "overflow:auto;";
this.graphContainer.nativeElement.id = "graphContainer";
this.graphContainer.nativeElement.innerHTML = "";
const graph = new mxGraph(this.graphContainer.nativeElement);
var graphcount = 0; // -> Gesamtanzahl der Graphen
var allgraphs= []; // Array in welchem die Tabllen cellen liegen (dienen auch als Parent für allcells[])
var allcells=[]; // Array in welchem die Attribute also Tabellenüberschrift und Attribute der Tabelle als Celle liegen
var cellInTablecount = 1; // Anzahl aller Cellen die als Attribute dienen
var realcellcount = 0; //Anzahl aller Cellen / dient dann auch für die Generierung der Indizes

  // Mit Doppelklick auf Tabellname die Tablle öffnen
graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) =>
   {
     if (evt.getProperty("cell")!= null) // nur wenn Cell ausgewählt
      {
         if (evt.getProperty("cell").value.includes('<h5><strong>')) // nur wenn Tabbelname ausgewählt ist
         {
          var sql = 'SELECT * FROM '+evt.getProperty("cell").value.match("<h5><strong>(.*)</strong></h5>")[1]+ ' ;' // holt die Tabellenüberschrift ohne html zusatz aus der Cell auf die geklickt wurde

          this.webSocketService.emit('get-schueler-table', sql);
          this.TableName.emit(evt.getProperty("cell").value.match("<h5><strong>(.*)</strong></h5>")[1])
         }
      }
    })

// Mit Einfachklick auf das Icon die Tabelle öffnen
graph.addListener(mxEvent.CLICK, (sender, evt) =>
{
  if (evt.getProperty("cell")!= null) // nur wenn Cell ausgewählt
   {
      if (evt.getProperty("cell").value.includes( '<i class="fas fa-external-link-alt"></i>')) // nur wenn Tabbelname ausgewählt ist
      {
       var sql = 'SELECT * FROM '+evt.getProperty("cell").parent.value.match("<h5><strong>(.*)</strong></h5>")[1]+ ' ;'// holt die Tabellenüberschrift ohne html zusatz aus der PerentCell der  Cell auf die geklickt wurde

       this.webSocketService.emit('get-schueler-table', sql);
       this.TableName.emit(evt.getProperty("cell").parent.value.match("<h5><strong>(.*)</strong></h5>")[1]) // Übergebe Name der Tabellenüberschrift and Parent Component
      }
   }
 })

globalvars.Attribut = [["*","*"]]; // bei Wechsel der Datenbank auch die Daten für Blockly zurücksetzen
globalvars.Table = [["",""]];

try {
  // Anpassungen des gesamten Graphen für unsere Zwecke -> selbsterklärend
  graph.setHtmlLabels(true);
  graph.autoSizeCellsOnAdd = true;
  graph.setCellsEditable (false);
  graph.setCellsResizable(false);
  graph.foldingEnabled = false;

  const parent = graph.getDefaultParent();
  graph.getModel().beginUpdate();

  // Einfügen aller Tabellen und Attribute
for (var i = 0 ; i < this.allsql.length; i++) // komplettes JSON Array durchlaufen
  {
  if (!inside.includes(this.allsql[i].table_name)) // wenn tabellename noch nicht vorkam: Parentcell erstellen in welche alle Attribute als Childcells reinkommen
      {
        cellInTablecount=1;
        graphcount ++;
        var attributmitryp = this.allsql[i].column_name+': '+this.allsql[i].column_type; // Attribut zusammen mit Typ als ein String
        if (this.allsql[i].column_key == "PRI") {attributmitryp = '<i class="fas fa-key"></i>'+attributmitryp } // Wenn Primarykey, dann Schlüsselsymbol hinzufügen

        // Parentcell bekommt Symbol, an welchem man es bewegen kann
        allgraphs[graphcount]= graph.insertVertex(parent, ""+graphcount, '<i class="fas fa-arrows-alt"></i>',20+((graphcount-1)% 5 )*200,20+ Math.floor((graphcount-1)/5)*200, 160, 20,"verticalAlign=bottom;verticalLabelPosition=top; labelPosition=ALIGN_LEFT;fontColor=#929292;");

        // Tabellenname als oberste Childcell
        allcells[realcellcount+1000]= graph.insertVertex(allgraphs[graphcount], ""+(i+100), "<h5><strong>"+this.allsql[i].table_name+"</strong></h5>",0,0,160,30, "fillColor=white;fontColor=black;movable=0;");

        // Zusätzliche Cell für Doppelclickfunktion -> öffnen einer
        graph.insertVertex(allcells[realcellcount+1000], ""+(i+100), '<i class="fas fa-external-link-alt"></i>',145,0,15,15, "rounded=1;fillColor=#4285f4;fontColor=white;movable=0;");

        // Erstes Attribut als Childcell in Parentcell einfügen
        allcells[realcellcount]= graph.insertVertex(allgraphs[graphcount], ""+(i+100), attributmitryp,0, 10+cellInTablecount*20,160,20,"movable=0");
        globalvars.Table.push([""+this.allsql[i].table_name,""+this.allsql[i].table_name]) // Tabellendefinition für Blockly
        globalvars.Attribut.push([this.allsql[i].table_name+"."+this.allsql[i].column_name,this.allsql[i].table_name+"."+this.allsql[i].column_name])// Tabellendefinition für Blockly
        realcellcount++
       inside.push(this.allsql[i].table_name); // Tabellenname in ein Array. Zur Überprüfung, ob Tabellename schon vorkam bzw, ob neue Parentcell gebaut werden muss
       cellInTablecount++;
      }
  else // wenn Tabellenname schon vorkam -> alle weiteren Attribute als Childcells einfügen (siehe oben)
      {
        var attributmitryp = this.allsql[i].column_name+': '+this.allsql[i].column_type;
        if (this.allsql[i].column_key == "PRI") {attributmitryp = '<i class="fas fa-key"></i>'+attributmitryp,"movable=0;"}
        allcells[realcellcount]= graph.insertVertex(allgraphs[graphcount], ""+(i+100), attributmitryp,0, 10+cellInTablecount*20,160,20,"movable=0;");
        globalvars.Attribut.push([this.allsql[i].table_name+"."+this.allsql[i].column_name,this.allsql[i].table_name+"."+this.allsql[i].column_name])// Tabellendefinition für Blockly
        realcellcount++;
        cellInTablecount++;
      }
      if (i == this.allsql.length-1 )
      {
        this.enableBlockly.emit(true);
      }
  }
  /// Alle foreign Keys als Pfeile anzeigen
  for (var t = 0 ; t < this.allsql.length; t++) //alle Attribute durchlaufen
  {
    for (var k = 0 ; k < this.allkeys.length; k++) // alle foreign Keys durchlaufen
    {
      if (this.allsql[t].column_name == this.allkeys[k].column_name && this.allsql[t].table_name==this.allkeys[k].table_name) // wenn Tabellen und Attributname gleich
       {
        for (var t2 = 0 ; t2 < this.allsql.length; t2++) // nochmal alle Attribute durchlaufen -> um die Zelle des referenced Attribut zu finden
        {
          {
            if (this.allsql[t2].column_name == this.allkeys[k].referenced_column_name && this.allsql[t2].table_name==this.allkeys[k].referenced_table_name) // wenn gefunden
             {
                 graph.insertEdge(null, '', '', allcells[t], allcells[t2],"edgeStyle=elbowEdgeStyle;elbow=horizontal;orthogonal=0;rounded=true;curved=1;fontColor=black;movable=0;editable=0"); // wird der Pfeil eingefügt
              }
        }
        }
    }
  }
}

  }
  finally
   {
    graph.getModel().endUpdate();
   }
  })
}
ngOnDestroy ()
  { // socket subscriptions wieder unsubsciben um memory-leak zu verhinden (bei vielen subs kann man die sicherlich in ein array pushen und mit ner schleife unsubben)
    this.subscriptionsendermjson.unsubscribe()
    this.graphContainer.nativeElement.remove();
  }
}
