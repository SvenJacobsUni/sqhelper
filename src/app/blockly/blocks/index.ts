import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';
import { globalvars } from '../../services/globalvars.service';

// ============================================
// STATEMENT BLOCKS (SELECT, FROM, WHERE, etc.)
// ============================================

Blockly.Blocks['SelectBlock'] = {
  init(this: Blockly.Block): void {
    this.setPreviousStatement(true, 'select_innerselect');
    this.setNextStatement(true, 'select_from');
    this.setColour(180);
    this.jsonInit({ mutator: 'select_mutator' });
  },
};

javascriptGenerator.forBlock['SelectBlock'] = function (
  block: any,
  generator: any
): string {
  const itemCount = block.itemCount_ || 0;
  if (itemCount === 0) {
    return 'SELECT ';
  }

  const items: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    const item = generator.statementToCode(block, 'ADD' + i) || '';
    items.push(item);
  }
  return 'SELECT ' + items.join(',') + ' ';
};

Blockly.Blocks['FromBlock'] = {
  init(this: Blockly.Block): void {
    this.setPreviousStatement(true, 'select_from');
    this.setNextStatement(true, ['from_where', 'from_groupby', 'from_orderby']);
    this.setColour(180);
    this.jsonInit({ mutator: 'from_mutator' });
  },
};

javascriptGenerator.forBlock['FromBlock'] = function (
  block: any,
  generator: any
): string {
  const itemCount = block.itemCount_ || 0;
  if (itemCount === 0) {
    return 'FROM ';
  }

  const items: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    let prefix = '';
    const currentBlock = block.getInputTargetBlock('ADD' + i);
    // Add prefix if it's not the first item and we have a valid block
    if (i > 0 && currentBlock) {
      if (currentBlock.type === 'JoinBlock') {
        prefix = ' ';
      } else {
        prefix = ', ';
      }
    }
    const item = generator.statementToCode(block, 'ADD' + i) || '';
    items.push(prefix + item);
  }
  return 'FROM ' + items.join('') + ' ';
};

Blockly.Blocks['WhereBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterWHERE')
      .appendField('WHERE')
      .setCheck(['operand', 'and', 'or', 'between', 'not', 'in']);
    this.setPreviousStatement(true, 'from_where');
    this.setNextStatement(true, ['orderby_where', 'where_groupby']);
    this.setColour(180);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['WhereBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = generator.statementToCode(block, 'afterWHERE');
  return 'WHERE ' + attr + ' ';
};

Blockly.Blocks['GroupByBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterGroupBy')
      .appendField('GROUP BY')
      .setCheck('attribut');
    this.setPreviousStatement(true, ['from_groupby', 'where_groupby']);
    this.setNextStatement(true, ['groupby_having', 'groupby_orderby']);
    this.setColour(180);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['GroupByBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = generator.statementToCode(block, 'afterGroupBy');
  return 'GROUP BY ' + attr + ' ';
};

Blockly.Blocks['OrderByBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterOrderBy')
      .appendField('ORDER BY')
      .setCheck(null);
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ['\u2009', ''],
        ['ASC', 'ASC'],
        ['DESC', 'DESC'],
      ]),
      'OrderByType'
    );
    this.setPreviousStatement(true, [
      'orderby_where',
      'from_orderby',
      'having_orderby',
      'groupby_orderby',
    ]);
    this.setNextStatement(true, 'where');
    this.setColour(180);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['OrderByBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = generator.statementToCode(block, 'afterOrderBy');
  const orderType = block.getFieldValue('OrderByType');
  return ' ORDER BY ' + attr + ' ' + orderType + ' ';
};

Blockly.Blocks['HavingBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterHaving')
      .appendField('HAVING')
      .setCheck(['operand', 'and', 'or', 'between', 'not', 'in']);
    this.setPreviousStatement(true, 'groupby_having');
    this.setNextStatement(true, 'having_orderby');
    this.setColour(180);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['HavingBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = generator.statementToCode(block, 'afterHaving');
  return ' HAVING ' + attr + ' ';
};

// ============================================
// TABLE & ATTRIBUTE BLOCKS
// ============================================

Blockly.Blocks['TableBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(() => globalvars.Table),
      'Table'
    );
    this.setOutput(true, 'table');
    this.setColour(210);
    this.setTooltip('Tabellenname');
  },
};

javascriptGenerator.forBlock['TableBlock'] = function (
  block: Blockly.Block
): string {
  return block.getFieldValue('Table') || '';
};

Blockly.Blocks['AttributBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(() => globalvars.Attribut),
      'Attribut'
    );
    this.setOutput(true, 'attribut');
    this.setColour(120);
    this.setTooltip('Eine Spalte aus einer Tabelle');
  },
};

javascriptGenerator.forBlock['AttributBlock'] = function (
  block: Blockly.Block
): string {
  return block.getFieldValue('Attribut') || '';
};

Blockly.Blocks['JoinBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterJoin')
      .appendField(
        new Blockly.FieldDropdown([
          ['\u2009', ' '],
          ['INNER', 'INNER'],
          ['LEFT', 'LEFT'],
          ['RIGHT', 'RIGHT'],
          ['FULL', 'FULL'],
        ]),
        'JoinType'
      )
      .appendField('JOIN')
      .appendField(
        new Blockly.FieldDropdown(() => globalvars.Table),
        'JoinTable'
      )
      .setCheck('operand')
      .appendField(
        new Blockly.FieldDropdown([
          ['\u2009', ''],
          ['ON', 'ON'],
        ]),
        'JoinOn'
      );
    this.setOutput(true, 'join');
    this.setColour(210);
  },
};

javascriptGenerator.forBlock['JoinBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = generator.statementToCode(block, 'afterJoin');
  const joinType = block.getFieldValue('JoinType');
  const joinTable = block.getFieldValue('JoinTable');
  const joinOn = block.getFieldValue('JoinOn');
  return joinType + ' JOIN ' + joinTable + ' ' + joinOn + ' ' + attr;
};

Blockly.Blocks['AliasBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterAlias').setCheck([
      'innerselect',
      'attribut',
      'function',
      'distinct',
    ]);
    this.appendDummyInput()
      .appendField('AS')
      .appendField(new Blockly.FieldTextInput('\u2009'), 'textInput');
    this.setOutput(true, 'alias');
    this.setColour(120);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['AliasBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = generator.statementToCode(block, 'afterAlias');
  const alias = block.getFieldValue('textInput');
  return attr + ' AS ' + alias;
};

Blockly.Blocks['DistinctBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterDistinct')
      .appendField('DISTINCT')
      .setCheck(['attribut']);
    this.setOutput(true, 'distinct');
    this.setColour(120);
    this.setInputsInline(false);
  },
};

javascriptGenerator.forBlock['DistinctBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = generator.statementToCode(block, 'afterDistinct');
  return 'DISTINCT ' + attr;
};

// ============================================
// OPERATOR & FUNCTION BLOCKS
// ============================================

Blockly.Blocks['OperandBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('a').setCheck([
      'innerselect',
      'attribut',
      'date',
      'boolean',
      'text',
      'number',
    ]);
    this.appendValueInput('b')
      .setCheck([
        'innerselect',
        'attribut',
        'date',
        'boolean',
        'text',
        'number',
      ])
      .appendField(
        new Blockly.FieldDropdown([
          ['=', '='],
          ['\u2260', '!='],
          ['>', '>'],
          ['\u2265', '>='],
          ['<', '<'],
          ['\u2264', '<='],
          ['LIKE', 'LIKE'],
          ['+', '+'],
          ['-', '-'],
          ['x', '*'],
          ['\u00f7', '/'],
        ]),
        'operand'
      );
    this.setOutput(true, 'operand');
    this.setColour(60);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['OperandBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const a = generator.statementToCode(block, 'a');
  const b = generator.statementToCode(block, 'b');
  const operand = block.getFieldValue('operand');
  return a + ' ' + operand + ' ' + b;
};

Blockly.Blocks['FunctionBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterFunction')
      .appendField(
        new Blockly.FieldDropdown([
          ['MIN', 'MIN'],
          ['MAX', 'MAX'],
          ['AVG', 'AVG'],
          ['SUM', 'SUM'],
          ['COUNT', 'COUNT'],
        ]),
        'function'
      )
      .setCheck(['innerselect', 'attribut', 'distinct']);
    this.setOutput(true, 'function');
    this.setColour(45);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['FunctionBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const funcType = block.getFieldValue('function');
  const attr = generator.statementToCode(block, 'afterFunction');
  return funcType + ' (' + attr + ')';
};

Blockly.Blocks['AndBlock'] = {
  init(this: Blockly.Block): void {
    this.setInputsInline(false);
    this.setColour(70);
    this.setOutput(true, 'and');
    this.jsonInit({ mutator: 'and_mutator' });
  },
};

javascriptGenerator.forBlock['AndBlock'] = function (
  block: any,
  generator: any
): string {
  const itemCount = block.itemCount_ || 0;
  if (itemCount === 0) {
    return '';
  }

  const items: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    const item = generator.statementToCode(block, 'ADD' + i) || '';
    items.push(item);
  }

  const firstAnd = generator.statementToCode(block, 'firstAnd') || '';
  return '(' + firstAnd + ' AND ' + items.join(' AND ') + ')';
};

Blockly.Blocks['OrBlock'] = {
  init(this: Blockly.Block): void {
    this.setInputsInline(false);
    this.setColour(70);
    this.setOutput(true, 'or');
    this.jsonInit({ mutator: 'or_mutator' });
  },
};

javascriptGenerator.forBlock['OrBlock'] = function (
  block: any,
  generator: any
): string {
  const itemCount = block.itemCount_ || 0;
  if (itemCount === 0) {
    return '';
  }

  const items: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    const item = generator.statementToCode(block, 'ADD' + i) || '';
    items.push(item);
  }

  const firstOr = generator.statementToCode(block, 'firstOr') || '';
  return '(' + firstOr + ' OR ' + items.join(' OR ') + ')';
};

Blockly.Blocks['NotBlock'] = {
  init(this: Blockly.Block): void {
    this.appendValueInput('afterNot')
      .appendField('NOT')
      .setCheck(['operand', 'and', 'or', 'between', 'in']);
    this.setOutput(true, 'not');
    this.setColour(70);
    this.setInputsInline(false);
  },
};

javascriptGenerator.forBlock['NotBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = generator.statementToCode(block, 'afterNot');
  return 'NOT ' + attr;
};

Blockly.Blocks['BetweenBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(() => globalvars.Attribut),
      'Attribut'
    );
    this.appendValueInput('a')
      .appendField(
        new Blockly.FieldDropdown([
          ['\u2009', ''],
          ['NOT', 'NOT'],
        ]),
        'not'
      )
      .appendField('BETWEEN')
      .setCheck(null);
    this.appendValueInput('b').appendField('AND').setCheck(null);
    this.setInputsInline(true);
    this.setColour(70);
    this.setOutput(true, 'between');
  },
};

javascriptGenerator.forBlock['BetweenBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = block.getFieldValue('Attribut');
  const notVal = block.getFieldValue('not');
  const a = generator.statementToCode(block, 'a');
  const b = generator.statementToCode(block, 'b');
  return attr + ' ' + notVal + ' BETWEEN ' + a + ' AND ' + b;
};

Blockly.Blocks['InBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown(() => globalvars.Attribut),
        'Attribut'
      )
      .appendField('IN   (')
      .setAlign(Blockly.inputs.Align.CENTRE);
    this.appendStatementInput('SelectPart').setCheck(null);
    this.appendDummyInput().appendField('      )');
    this.setColour(70);
    this.setOutput(true, 'in');
  },
};

javascriptGenerator.forBlock['InBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const attr = block.getFieldValue('Attribut');
  const statements = generator.statementToCode(block, 'SelectPart');
  return attr + ' IN (' + statements + ')';
};

Blockly.Blocks['InnerSelectBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput()
      .appendField('     (')
      .setAlign(Blockly.inputs.Align.CENTRE);
    this.appendStatementInput('innerSelectPart').setCheck(null);
    this.appendDummyInput().appendField('      )');
    this.setColour(0);
    this.setOutput(true, 'innerselect');
  },
};

javascriptGenerator.forBlock['InnerSelectBlock'] = function (
  block: Blockly.Block,
  generator: any
): string {
  const statements = generator.statementToCode(block, 'innerSelectPart');
  return '( ' + statements + ' )';
};

// ============================================
// INPUT BLOCKS (Text, Number, Date, Boolean, Free)
// ============================================

Blockly.Blocks['TextBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput()
      .appendField('\u201C')
      .appendField(new Blockly.FieldTextInput('\u2009'), 'textInput')
      .appendField('\u201D');
    this.setOutput(true, 'text');
    this.setColour(300);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['TextBlock'] = function (
  block: Blockly.Block
): string {
  const text = block.getFieldValue('textInput');
  return "'" + text + "'";
};

Blockly.Blocks['NumberBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput().appendField(
      new Blockly.FieldNumber(0),
      'numberInput'
    );
    this.setOutput(true, 'number');
    this.setColour(300);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['NumberBlock'] = function (
  block: Blockly.Block
): string {
  return '' + block.getFieldValue('numberInput');
};

Blockly.Blocks['DateBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput()
      .appendField('Jahr:')
      .appendField(new Blockly.FieldNumber(2018), 'date_year');
    this.appendDummyInput()
      .appendField('Monat:')
      .appendField(new Blockly.FieldNumber(1, 1, 12), 'date_month');
    this.appendDummyInput()
      .appendField('Tag:')
      .appendField(new Blockly.FieldNumber(1, 1, 31), 'date_day');
    this.setInputsInline(true);
    this.setOutput(true, 'date');
    this.setColour(300);
  },
};

javascriptGenerator.forBlock['DateBlock'] = function (
  block: Blockly.Block
): string {
  const year = block.getFieldValue('date_year');
  let month = block.getFieldValue('date_month');
  let day = block.getFieldValue('date_day');

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  return "'" + year + '-' + month + '-' + day + "'";
};

Blockly.Blocks['BooleanBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ['true', 'true'],
        ['false', 'false'],
      ]),
      'booleanvalue'
    );
    this.setInputsInline(true);
    this.setOutput(true, 'boolean');
    this.setColour(300);
  },
};

javascriptGenerator.forBlock['BooleanBlock'] = function (
  block: Blockly.Block
): string {
  return ' ' + block.getFieldValue('booleanvalue');
};

Blockly.Blocks['FreeBlock'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput('\u2009'),
      'freeInput'
    );
    this.setOutput(true, null);
    this.setColour(0);
    this.setInputsInline(true);
  },
};

javascriptGenerator.forBlock['FreeBlock'] = function (
  block: Blockly.Block
): string {
  return '' + block.getFieldValue('freeInput');
};

// ============================================
// REGISTRATION
// ============================================

export function registerBlocks(): void {
  console.log('SQL Blocks registered');
}
