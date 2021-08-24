import { BlockMutator, CustomBlock } from 'ngx-blockly';
import { globalvars } from '../../globalvars';
declare var Blockly: any;

export class JoinBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('JoinBlock', block, blockMutator);
    this.class = JoinBlock;
  }

  defineBlock() {
    this.block
      .appendValueInput('afterJoin')
      .appendField(
        new Blockly.FieldDropdown([
          ['\u2009', ' '],
          ['INNER', 'INNER'],
          ['LEFT', 'LEFT'],
          ['RIGHT', 'RIGHT'],
          ['FULL', 'FULL'],
        ]),
        'JoinType'
      )
      .appendField('JOIN')
      .appendField(new Blockly.FieldDropdown(this.generateOptions), 'JoinTable')
      .setCheck("operand")
      .appendField(
        new Blockly.FieldDropdown([
          ['\u2009', ''],
          ['ON', 'ON']
        ]),
        'JoinOn'
      );
    this.block.setOutput(true, 'join');
    this.block.setColour(210);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
    this.block.setOnChange(function (changeEvent) {
      console.log('change');
    });
  }

  public toJavaScriptCode(block: JoinBlock): string | any[] {
    var attr = Blockly.JavaScript.statementToCode(block, 'afterJoin');
    var dropdown_join_type = this.block.getFieldValue('JoinType');
    var dropdown_join_table = this.block.getFieldValue('JoinTable');
    var dropdown_join_on = this.block.getFieldValue('JoinOn');

    var code =
      dropdown_join_type +
      ' JOIN ' +
      dropdown_join_table +
      ' ' +
      dropdown_join_on +
      ' ' +
      attr;

    return code;
  }

  generateOptions() {
    return globalvars.Table;
  }
}
