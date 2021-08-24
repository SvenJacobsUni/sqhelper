import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class HavingBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('HavingBlock', block, blockMutator);
    this.class = HavingBlock;
  }

  defineBlock() {
    this.block
      .appendValueInput('afterHaving')
      .appendField('HAVING')
      .setCheck([ 'operand','and','or','between','not','in']);

    this.block.setPreviousStatement(true, 'groupby_having'); // Was ist vorher erlaubt
    this.block.setNextStatement(true, 'having_orderby');
    this.block.setColour(180);
    this.block.setInputsInline(true);
  }

  public toJavaScriptCode(block: HavingBlock): string | any[] {
    var attr = Blockly.JavaScript.statementToCode(block, 'afterHaving');

    var code = ' HAVING ' + attr;

    return code;
  }
}
