import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class FreeBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('FreeBlock', block, blockMutator);
    this.class = FreeBlock;
  }

  defineBlock() {
    this.block
      .appendDummyInput()
      .appendField(new Blockly.FieldTextInput('\u2009'), 'freeInput')
    this.block.setOutput(true,null);
    this.block.setColour(0);
    this.block.setInputsInline(true);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: FreeBlock): string | any[] {
    var freeinput = this.block.getFieldValue('freeInput');
    var code = "" + freeinput ;
    return code;
  }
}
