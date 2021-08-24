import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class TextBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('TextBlock', block, blockMutator);
    this.class = TextBlock;
  }

  defineBlock() {
    this.block
      .appendDummyInput()
      .appendField('\u201C')
      .appendField(new Blockly.FieldTextInput('\u2009'), 'textInput')
      .appendField('\u201D');
    this.block.setOutput(true, 'text');
    this.block.setColour(300);
    this.block.setInputsInline(true);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: TextBlock): string | any[] {
    var textinput = this.block.getFieldValue('textInput');
    var code = "'" + textinput + "'";
    return code;
  }
}
