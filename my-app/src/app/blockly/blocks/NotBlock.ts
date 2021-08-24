import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class NotBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('NotBlock', block, blockMutator);
    this.class = NotBlock;
  }

  defineBlock() {

      this.block
      .appendValueInput('afterNot')
      .appendField('NOT')
      .setCheck([ 'operand','and','or','between','in']);
    this.block.setOutput(true, 'not');
    this.block.setColour(70);
    this.block.setInputsInline(false);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: NotBlock): string | any[] {
    var attr = Blockly.JavaScript.statementToCode(block, 'afterNot');
    var code = "NOT "+attr;
    return code;
  }
}
