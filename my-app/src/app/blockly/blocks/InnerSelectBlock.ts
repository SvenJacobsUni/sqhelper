import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class InnerSelectBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('InnerSelectBlock', block, blockMutator);
    this.class = InnerSelectBlock;
  }

  defineBlock() {
    this.block
      .appendDummyInput()
      .appendField('     (')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.block.appendStatementInput('innerSelectPart').setCheck(null);
    this.block.appendDummyInput().appendField('      )');
    this.block.setColour(0);
    this.block.setOutput(true, 'innerselect');
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: InnerSelectBlock): string | any[] {
    var statements = Blockly.JavaScript.statementToCode(
      block,
      'innerSelectPart'
    );
    var code = '( ' + statements + ' )';

    return code;
  }
}
