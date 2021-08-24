import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class FunctionBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('FunctionBlock', block, blockMutator);
    this.class = FunctionBlock;
  }

  defineBlock() {
    this.block
      .appendValueInput('afterFunction')
      .appendField(
        new Blockly.FieldDropdown([
          ['MIN', 'MIN'],
          ['MAX', 'MAX'],
          ['AVG', 'AVG'],
          ['SUM', 'SUM'],
          ['COUNT', 'COUNT'],
        ]),
        'function'
      )
      .setCheck(['innerselect', 'attribut','distinct']);

    this.block.setOutput(true, 'function');
    this.block.setColour(45);
    this.block.setInputsInline(true);
  }

  public toJavaScriptCode(block: FunctionBlock): string | any[] {
    var dropdown_function_type = this.block.getFieldValue('function');
    var attr = Blockly.JavaScript.statementToCode(block, 'afterFunction');

    var code = dropdown_function_type + ' (' + attr + ')';

    return code;
  }
}
