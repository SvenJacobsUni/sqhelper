import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class DistinctBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('DistinctBlock', block, blockMutator);
    this.class = DistinctBlock;
  }

  defineBlock() {

      this.block
      .appendValueInput('afterDistinct')
      .appendField('DISTINCT')
      .setCheck(['attribut']);
    this.block.setOutput(true, 'distinct');
    this.block.setColour(120);
    this.block.setInputsInline(false);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: DistinctBlock): string | any[] {
    var attr = Blockly.JavaScript.statementToCode(block, 'afterDistinct');
    var code = "DISTINCT "+attr;
    return code;
  }
}
