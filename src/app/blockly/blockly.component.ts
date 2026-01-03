import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Import blocks and mutators
import { registerBlocks } from './blocks';
import { registerMutators } from './mutators';
import { GlobalVarsService } from '../services/globalvars.service';

@Component({
  selector: 'app-blockly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blockly.component.html',
  styleUrl: './blockly.component.scss',
})
export class BlocklyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('blocklyDiv', { static: true }) blocklyDiv!: ElementRef<HTMLDivElement>;
  @Output() blocklyCode = new EventEmitter<string>();

  private workspace: Blockly.WorkspaceSvg | null = null;
  private globalVarsService = inject(GlobalVarsService);

  private readonly toolbox = `
    <xml id="toolbox" style="display: none">
      <category name="Statements" colour="180">
        <block type="SelectBlock"><mutation items="1"></mutation></block>
        <block type="FromBlock"><mutation items="1"></mutation></block>
        <block type="WhereBlock"></block>
        <block type="GroupByBlock"></block>
        <block type="OrderByBlock"></block>
        <block type="HavingBlock"></block>
      </category>
      <category name="Tabellen und Attribute" colour="210">
        <label text="Attribute"></label>
        <block type="AttributBlock"></block>
        <label text="Alias"></label>
        <block type="AliasBlock"></block>
        <label text="Distinct"></label>
        <block type="DistinctBlock"></block>
        <label text="Tabellen"></label>
        <block type="TableBlock"></block>
        <label text="Join"></label>
        <block type="JoinBlock"></block>
      </category>
      <category name="Operanden und Funktionen" colour="60">
        <label text="Funktionen"></label>
        <block type="FunctionBlock"></block>
        <label text="Operanden"></label>
        <block type="OperandBlock"></block>
        <block type="AndBlock"><mutation items="1"></mutation></block>
        <block type="OrBlock"><mutation items="1"></mutation></block>
        <block type="BetweenBlock"></block>
        <block type="NotBlock"></block>
        <block type="InBlock"></block>
      </category>
      <category name="Eingaben" colour="300">
        <label text="Text"></label>
        <block type="TextBlock"></block>
        <label text="Zahl"></label>
        <block type="NumberBlock">
          <field name="numberInput">0</field>
        </block>
        <label text="Datum"></label>
        <block type="DateBlock"></block>
        <label text="Boolean"></label>
        <block type="BooleanBlock"></block>
      </category>
      <category name="Erweitert" colour="0">
        <label text="verschachteln"></label>
        <block type="InnerSelectBlock"></block>
        <label text="freie Eingabe"></label>
        <block type="FreeBlock"></block>
      </category>
    </xml>
  `;

  private readonly defaultWorkspace = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="SelectBlock" x="99" y="49">
        <mutation items="1"/>
        <value name="ADD0">
          <block type="AttributBlock">
            <field name="Attribut">*</field>
          </block>
        </value>
        <next>
          <block type="FromBlock">
            <mutation items="1"/>
          </block>
        </next>
      </block>
    </xml>
  `;

  ngOnInit(): void {
    // Register mutators and blocks
    registerMutators();
    registerBlocks();
  }

  ngAfterViewInit(): void {
    this.initWorkspace();
    this.loadWorkspace();
  }

  ngOnDestroy(): void {
    if (this.workspace) {
      this.workspace.dispose();
    }
  }

  private initWorkspace(): void {
    this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox: this.toolbox,
      scrollbars: true,
      trashcan: true,
      zoom: {
        controls: false,
        wheel: false,
        startScale: 1,
        maxScale: 2,
        minScale: 0.3,
        scaleSpeed: 1.0,
      },
      media: 'assets/',
    });

    // Listen for workspace changes
    this.workspace.addChangeListener((event) => {
      if (
        event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE ||
        event.type === Blockly.Events.BLOCK_MOVE
      ) {
        this.generateCode();
      }
    });
  }

  private loadWorkspace(): void {
    if (!this.workspace) return;

    const savedWorkspace = localStorage.getItem('sql_workspace');
    if (savedWorkspace) {
      try {
        const dom = Blockly.utils.xml.textToDom(savedWorkspace);
        Blockly.Xml.domToWorkspace(dom, this.workspace);
      } catch (e) {
        console.error('Failed to load saved workspace:', e);
        this.loadDefaultWorkspace();
      }
    } else {
      this.loadDefaultWorkspace();
    }
  }

  private loadDefaultWorkspace(): void {
    if (!this.workspace) return;

    try {
      const dom = Blockly.utils.xml.textToDom(this.defaultWorkspace);
      Blockly.Xml.domToWorkspace(dom, this.workspace);
    } catch (e) {
      console.error('Failed to load default workspace:', e);
    }
  }

  private generateCode(): void {
    if (!this.workspace) return;

    try {
      const code = javascriptGenerator.workspaceToCode(this.workspace);
      this.blocklyCode.emit(code);
      this.saveWorkspace();
    } catch (e) {
      console.error('Failed to generate code:', e);
    }
  }

  private saveWorkspace(): void {
    if (!this.workspace) return;

    try {
      const dom = Blockly.Xml.workspaceToDom(this.workspace);
      const xml = Blockly.Xml.domToText(dom);
      localStorage.setItem('sql_workspace', xml);
    } catch (e) {
      console.error('Failed to save workspace:', e);
    }
  }

  /** Public method to get current SQL code */
  getCode(): string {
    if (!this.workspace) return '';
    return javascriptGenerator.workspaceToCode(this.workspace);
  }

  /** Public method to clear workspace */
  clearWorkspace(): void {
    if (!this.workspace) return;
    this.workspace.clear();
    this.loadDefaultWorkspace();
  }

  /** Public method to resize workspace */
  onResize(): void {
    if (this.workspace) {
      Blockly.svgResize(this.workspace);
    }
  }
}
