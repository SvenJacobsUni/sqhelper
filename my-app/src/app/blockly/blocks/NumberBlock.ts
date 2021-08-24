import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class NumberBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('NumberBlock', block, blockMutator);
    this.class = NumberBlock;
  }

  defineBlock() {
    this.block
      .appendDummyInput()
      .appendField(new Blockly.FieldNumber(0), 'numberInput');
    this.block.setOutput(true, 'number');
    this.block.setColour(300);
    this.block.setInputsInline(true);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: NumberBlock): string | any[] {
    var numberinput = this.block.getFieldValue('numberInput');
    var code = '' + numberinput;
    return code;
  }
}
