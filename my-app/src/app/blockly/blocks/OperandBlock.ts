import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class OperandBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('OperandBlock', block, blockMutator);
    this.class = OperandBlock;
  }

  defineBlock() {
    this.block.appendValueInput('a')
    .setCheck(['innerselect', 'attribut', 'date', 'boolean', 'text', 'number']);
    this.block
      .appendValueInput('b')
      .setCheck(['innerselect', 'attribut', 'date', 'boolean', 'text', 'number'])
      .appendField(
        new Blockly.FieldDropdown([
          ['=', '='],
          ['≠', '≠'],
          ['>', '>'],
          ['≥', '>='],
          ['<', '<'],
          ['≤', '<='],
          ['LIKE', 'LIKE'],
          ['+', '+'],
          ['-', '-'],
          ['x', '*'],
          ['÷', '/'],
        ]),
        'operand'
      );

    this.block.setOutput(true, 'operand');
    this.block.setColour(60);
    this.block.setInputsInline(true);
  }

  public toJavaScriptCode(block: OperandBlock): string | any[] {
    var a = Blockly.JavaScript.statementToCode(block, 'a');
    var b = Blockly.JavaScript.statementToCode(block, 'b');
    var dropdown_operand_type = this.block.getFieldValue('operand');
    var code = a + ' ' + dropdown_operand_type + '' + b;

    return code;
  }
}
