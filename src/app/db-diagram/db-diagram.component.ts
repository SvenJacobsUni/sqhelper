import { Component, OnInit, OnDestroy, Output, EventEmitter, signal, WritableSignal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SqliteService, SchemaInfo, SchemaItem } from '../services/sqlite.service';
import { Vflow, Edge, DynamicNode, VflowComponent } from 'ngx-vflow';
import { MatIconModule } from '@angular/material/icon';
import init, { DirectedGraph, VertexWeakRef, RankDir, Curve } from '@vizdom/vizdom-ts-web';

interface TableData {
  tableName: string;
  columns: {
    name: string;
    type: string;
    isPK: boolean;
    hasSourceHandle?: boolean;
    hasTargetHandle?: boolean;
  }[];
}

interface TableNode {
  id: string;
  point: WritableSignal<{ x: number; y: number }>;
  type: string;
  draggable?: WritableSignal<boolean>;
  data: WritableSignal<TableData>;
}

@Component({
  selector: 'app-db-diagram',
  standalone: true,
  imports: [CommonModule, Vflow, MatIconModule],
  templateUrl: './db-diagram.component.html',
  styleUrl: './db-diagram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DbDiagramComponent implements OnInit, OnDestroy {
  @Output() TableName = new EventEmitter<string>();
  @Output() enableBlockly = new EventEmitter<void>();

  public vflow = viewChild.required(VflowComponent);
  public nodes: WritableSignal<DynamicNode[]> = signal([]);
  public edges: WritableSignal<Edge[]> = signal([]);

  schema: SchemaInfo | null = null;
  private subscription: Subscription | null = null;
  private vizdomInitialized = false;

  constructor(private sqliteService: SqliteService) { }

  async ngOnInit(): Promise<void> {
    try {
      await init('assets/vizdom/vizdom_ts_bg.wasm');
      this.vizdomInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Vizdom:', error);
    }

    this.subscription = this.sqliteService.schema$.subscribe((schema) => {
      this.schema = schema;
      this.checkAndBuild(schema);
    });
  }

  private checkAndBuild(schema: SchemaInfo | null, attempts = 0): void {
    if (!schema) return;

    if (this.vizdomInitialized) {
      this.buildDiagram(schema);
      this.enableBlockly.emit();
    } else if (attempts < 10) {
      setTimeout(() => this.checkAndBuild(schema, attempts + 1), 200);
    } else {
      console.error("Vizdom failed to initialize in time.");
    }
  }

  private buildDiagram(schema: SchemaInfo): void {
    const tableMap = new Map<string, SchemaItem[]>();
    for (const item of schema.items) {
      if (!tableMap.has(item.table_name)) {
        tableMap.set(item.table_name, []);
      }
      tableMap.get(item.table_name)!.push(item);
    }

    const nodesToLayout: DynamicNode[] = [];

    // 1. Identify active handles (columns that are source or target of an FK)
    const activeHandles = new Map<string, { source: Set<string>; target: Set<string> }>();

    // Helper to get or create handle sets for a table
    const getHandles = (tableName: string) => {
      if (!activeHandles.has(tableName)) {
        activeHandles.set(tableName, { source: new Set(), target: new Set() });
      }
      return activeHandles.get(tableName)!;
    };

    if (schema.keys) {
      for (const fk of schema.keys) {
        // Source side
        getHandles(fk.table_name).source.add(fk.column_name);

        // Target side
        // If referencing a specific column, use it. Otherwise, defaults to PK (Primary Key).
        let targetCol = fk.referenced_column_name;
        if (!targetCol && tableMap.has(fk.referenced_table_name)) {
          // Find PK of referenced table
          const targetTableCols = tableMap.get(fk.referenced_table_name)!;
          const pkCol = targetTableCols.find(c => c.column_key === 'PRI');
          if (pkCol) {
            targetCol = pkCol.column_name;
          }
        }

        if (targetCol) {
          getHandles(fk.referenced_table_name).target.add(targetCol);
        }
      }
    }



    tableMap.forEach((columns, tableName) => {
      const handles = activeHandles.get(tableName);
      nodesToLayout.push({
        id: tableName,
        point: signal({ x: 0, y: 0 }),
        type: 'html-template',
        draggable: signal(true),
        data: signal<TableData>({
          tableName,
          columns: columns.map(col => ({
            name: col.column_name,
            type: col.column_type,
            isPK: col.column_key === 'PRI',
            hasSourceHandle: handles?.source.has(col.column_name),
            hasTargetHandle: handles?.target.has(col.column_name)
          }))
        })
      });
    });

    const edgesToLayout: Edge[] = [];
    for (const fk of schema.keys) {
      if (tableMap.has(fk.table_name) && tableMap.has(fk.referenced_table_name)) {
        const targetCols = tableMap.get(fk.referenced_table_name);
        const targetColName = fk.referenced_column_name || targetCols?.find(c => c.column_key === 'PRI')?.column_name;

        if (targetColName) {
          edgesToLayout.push({
            id: `fk-${fk.table_name}-${fk.column_name}`,
            source: fk.table_name,
            target: fk.referenced_table_name,
            sourceHandle: `${fk.column_name}_source`,
            targetHandle: `${targetColName}_target`,
            type: 'default',
            curve: 'smooth-step',
            markers: {
              end: { type: 'arrow' }
            }
          });
        }
      }
    }

    this.layout(nodesToLayout, edgesToLayout);
  }

  private layout(nodesToLayout: DynamicNode[], edgesToLayout: Edge[] = []) {
    const graph = new DirectedGraph({
      layout: {
        margin_x: 20,
        margin_y: 20,
        rank_sep: 40,
        node_sep: 40,
        rank_dir: RankDir.LR
      },
    });

    const vertices = new Map<string, VertexWeakRef>();
    const nodeMap = new Map<string, DynamicNode>();

    nodesToLayout.forEach((n) => {
      const tableNode = n as unknown as TableNode;
      const data = tableNode.data();

      // Dynamic Size Calculation
      let maxLen = data.tableName.length;
      data.columns.forEach(c => {
        const len = c.name.length + (c.type ? c.type.length : 0) + 4;
        if (len > maxLen) maxLen = len;
      });

      const charWidth = 9;
      const padding = 40;
      const calculatedWidth = Math.min(Math.max((maxLen * charWidth) + padding, 180), 400);
      const height = 40 + (data.columns.length * 28) + 10;

      const v = graph.new_vertex(
        {
          layout: {
            shape_w: calculatedWidth,
            shape_h: height,
          },
          render: {
            id: n.id,
          },
        },
        {
          compute_bounding_box: false,
        },
      );

      vertices.set(n.id, v);
      nodeMap.set(n.id, n);
    });

    edgesToLayout.forEach((e) => {
      if (vertices.has(e.source) && vertices.has(e.target)) {
        graph.new_edge(vertices.get(e.source)!, vertices.get(e.target)!, {
          render: {
            curve: Curve.Straight
          }
        });
      }
    });

    try {
      const layout = graph.layout().to_json().to_obj();

      // Update Nodes
      layout.nodes.forEach((n: any) => {
        const rawNode = nodeMap.get(n.id!);
        if (rawNode) {
          const tableNode = rawNode as unknown as TableNode;
          tableNode.point.set({ x: n.x, y: n.y });
        }
      });

      // Edges: No custom routing. Let vflow handle 'smooth-step' rendering.
      // Vizdom ensures nodes are placed such that edges *can* be drawn nicely.

      this.nodes.set(nodesToLayout);
      this.edges.set(edgesToLayout);

      setTimeout(() => {
        if (this.nodes().length > 0) {
          this.vflow().fitView({ duration: 500 });
        }
      }, 100);
    } catch (e) {
      console.error("Vizdom layout failed", e);
    }
  }

  openTable(tableName: string): void {
    this.sqliteService.executeQuery(`SELECT * FROM "${tableName}"`);
    this.TableName.emit(tableName);
  }

  onNodeDoubleClick(node: any): void {
    const tableNode = node as TableNode;
    if (typeof tableNode.data === 'function') {
      const data = tableNode.data();
      if (data?.tableName) {
        this.openTable(data.tableName);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
