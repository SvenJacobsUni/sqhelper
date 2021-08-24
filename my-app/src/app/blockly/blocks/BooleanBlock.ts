import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class BooleanBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('BooleanBlock', block, blockMutator);
    this.class = BooleanBlock;
  }

  defineBlock() {
    this.block.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ['true', 'true'],
        ['false', 'false'],
      ]),
      'booleanvalue'
    );

    this.block.setInputsInline(true);
    this.block.setOutput(true, 'boolean');
    this.block.setColour(300);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: BooleanBlock): string | any[] {
    var dropdown_operand_type = this.block.getFieldValue('booleanvalue');

    var code = ' ' + dropdown_operand_type;
    return code;
  }
}
