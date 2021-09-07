import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgxBlocklyConfig, NgxBlocklyGeneratorConfig, NgxBlocklyComponent } from 'ngx-blockly';

import { AttributBlock } from './blocks/AttributBlock';
import { TableBlock } from './blocks/TableBlock';
import { FromBlock } from './blocks/FromBlock';
import { SelectBlock } from './blocks/Selectblock';
import { WhereBlock } from './blocks/WhereBlock';
import { GroupByBlock } from './blocks/GroupByBlock';
import { OrderByBlock } from './blocks/OrderByBlock';
import { HavingBlock } from './blocks/HavingBlock';
import { JoinBlock } from './blocks/JoinBlock';
import { OperandBlock } from './blocks/OperandBlock';
import { AliasBlock } from './blocks/AliasBlock';
import { FunctionBlock } from './blocks/FunctionBlock';
import { InnerSelectBlock } from './blocks/InnerSelectBlock';
import { DateBlock } from './blocks/DateBlock';
import { BooleanBlock } from './blocks/BooleanBlock';
import { TextBlock } from './blocks/TextBlock';
import { NumberBlock } from './blocks/NumberBlock';
import { FreeBlock } from './blocks/FreeBlock';
import { AndBlock } from './blocks/AndBlock';
import { OrBlock } from './blocks/OrBlock';
import { BetweenBlock } from './blocks/BetweenBlock';
import { NotBlock } from './blocks/NotBlock';
import { InBlock } from './blocks/InBlock';
import { DistinctBlock } from './blocks/DistinctBlock';

import * as FromMutator from './mutators/FromMutator';
import * as SelectMutator from './mutators/SelectMutator';
import * as AndMutator from './mutators/AndMutator';
import * as OrMutator from './mutators/OrMutator';


/// import * as join from './mutators/join.js'; fremde blocks können importiert werden
@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.css'],
})
export class BlocklyComponent implements OnInit {

  @ViewChild( NgxBlocklyComponent) workspace;
  @Output() BlocklyCode = new EventEmitter();

  public AllBlocks = [
    new SelectBlock(null,null),
    new FromBlock(null, null),
    new WhereBlock(null, null),
    new GroupByBlock(null, null),
    new OrderByBlock(null, null),
    new HavingBlock(null, null),
    new AttributBlock(null, null),
    new TableBlock(null, null),
    new JoinBlock(null, null),
    new OperandBlock(null, null),
   // new AliasBlock(null, new ExampleMutator("example_mutator")), // mutator kann hier hinzugefügt werden
    new FunctionBlock(null, null),
    new AliasBlock(null, null),
    new InnerSelectBlock(null, null),
    new DateBlock(null, null),
    new BooleanBlock(null, null),
    new TextBlock(null, null),
    new NumberBlock(null, null),
    new FreeBlock(null, null),
    new AndBlock(null, null),
    new OrBlock(null, null),
    new BetweenBlock(null, null),
    new NotBlock(null, null),
    new InBlock(null, null),
    new DistinctBlock(null, null),
  ];

  public config: NgxBlocklyConfig = {
    toolbox: '<xml id="toolbox" style="display: none">' +

                    '<category name="Statements" colour="180">' +
                      '<block type="SelectBlock"><mutation items="1"></mutation></block>' +
                    //  '<block type="TestJoinBlock"></block>' +
                      '<block type="FromBlock"><mutation items="1"></mutation></block>' +
                      '<block type="WhereBlock"></block>' +
                      '<block type="GroupByBlock"></block>' +
                      '<block type="OrderByBlock"></block>' +
                      '<block type="HavingBlock"></block>' +
                    '</category>' +
                    '<category name="Tabellen und Attribute" colour="210">' +
                      '<label text="Attribute"></label>' +
                      '<block type="AttributBlock"></block>' +
                      '<label text="Alias"></label>' +
                      '<block type="AliasBlock"></block>' +
                      '<label text="Distinct"></label>' +
                      '<block type="DistinctBlock"></block>' +
                      '<label text="Tabellen"></label>' +
                      '<block type="TableBlock"></block>' +
                      '<label text="Join"></label>' +
                      '<block type="JoinBlock"></block>' +
                    '</category>' +
                    '<category name="Operanden und Funktionen" colour="60">' +
                      '<label text="Funktionen"></label>' +
                      '<block type="FunctionBlock"></block>' +
                      '<label text="Operanden"></label>' +
                      '<block type="OperandBlock"></block>' +
                      '<block type="AndBlock"><mutation items="1"></mutation></block>' +
                      '<block type="OrBlock"><mutation items="1"></mutation></block>' +
                      '<block type="BetweenBlock"></block>' +
                      '<block type="NotBlock"></block>' +
                      '<block type="InBlock"></block>' +
                    '</category>' +
                    '<category name="Eingaben" colour="300">' +
                      '<label text="Text"></label>' +
                      '<block type="TextBlock"></block>' +
                      '<label text="Zahl"></label>' +
                      '<block type="NumberBlock">'+
                      '<field name="numberInput">0</field>'+
                      '</block>' +
                      '<label text="Datum"></label>' +
                      '<block type="DateBlock"></block>' +
                      '<label text="Boolean"></label>' +
                      '<block type="BooleanBlock"></block>' +
                    '</category>' +
                    '<category name="Erweitert" colour="0">' +
                      '<label text="verschachteln"></label>' +
                      '<block type="InnerSelectBlock"></block>' +
                      '<label text="freie Eingabe"></label>' +
                      '<block type="FreeBlock"></block>' +
                  '</category>' +
                 '</xml>',

    scrollbars: true,
    trashcan: true,
    search: {
      enabled: true,
      placeholder: "Block suchen"
     },
    zoom: {
      controls: false,
      wheel: false,
      startScale: 1,
      maxScale: 2,
      minScale: 0.3,
      scaleSpeed: 1.0
  },
  media: "../assets/"
  };

  public generatorConfig: NgxBlocklyGeneratorConfig = {
    dart: false,
    javascript: true,
    lua: false,
    php: false,
    python: false,
  };

  onCode(code: any) {
    this.BlocklyCode.emit(code); // Generierten SQL Code an Parent Component übergeben
    window.localStorage.setItem("sql_workspace", this.workspace.toXml()); // Workspace im Localstorage speichern
  }

  constructor() { }

  ngOnInit(): void {
    // Mutator initialisieren
    FromMutator;
    SelectMutator;
    AndMutator;
    OrMutator;

   // join; block.js können auch importiert werden
  }

  ngAfterViewInit () // alten Workspace aus dem Webtoken laden
  {
    if(localStorage.getItem("sql_workspace"))
    {
        this.workspace.fromXml(localStorage.getItem("sql_workspace"));
    }
    else // wenn noch keiner verfügbar : "Select * From"
    {
      this.workspace.fromXml(
      '<xml xmlns="https://developers.google.com/blockly/xml"> '+
      '<block type="SelectBlock" id="kCE#Y,%5C5.F[DKS.Z(l" x="99" y="49"> '+
      ' <mutation items="1"/> '+
      '<value name="ADD0"> '+
      '<block type="AttributBlock" id="Z09`E0D3!eHH+paxUos3"> '+
      ' <field name="Attribut">*</field> '+
      ' </block> '+
      ' </value> '+
      ' <next> '+
      '<block type="FromBlock" id="86=}Ge^+3Nk,z:glw(}1"> '+
      '  <mutation items="1"/> '+
      ' </block> '+
      ' </next> '+
      ' </block> '+
      '</xml>'
      )
    }
  }

}
