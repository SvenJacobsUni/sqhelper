import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class WhereBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('WhereBlock', block, blockMutator);
    this.class = WhereBlock;
  }

  defineBlock() {
    this.block
      .appendValueInput('afterWHERE')
      .appendField('WHERE')
      .setCheck([ 'operand','and','or','between','not','in']);
    this.block.setPreviousStatement(true, 'from_where');
    this.block.setNextStatement(true, ['orderby_where', 'where_groupby']);
    this.block.setColour(180);
    this.block.setInputsInline(true);
  }

  public toJavaScriptCode(block: WhereBlock): string | any[] {
    var attr = Blockly.JavaScript.statementToCode(block, 'afterWHERE');

    var code = 'WHERE ' + attr;

    return code;
  }
}
