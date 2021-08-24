import { BlockMutator, CustomBlock } from 'ngx-blockly';
import { globalvars } from 'src/app/globalvars';
declare var Blockly: any;

export class InBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('InBlock', block, blockMutator);
    this.class = InBlock;
  }

  defineBlock() {
    this.block
      .appendDummyInput()
      .appendField(new Blockly.FieldDropdown(this.generateOptions), 'Attribut')
      .appendField('IN   (')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.block.appendStatementInput('SelectPart').setCheck(null);
    this.block.appendDummyInput().appendField('      )');
    this.block.setColour(70);
    this.block.setOutput(true, 'in');
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: InBlock): string | any[] {
    var statements = Blockly.JavaScript.statementToCode(
      block,
      'SelectPart'
    );
    var attribut = this.block.getFieldValue( 'Attribut');
    var code = attribut +' IN (' + statements + ')';

    return code;
  }
  generateOptions() {
    return globalvars.Attribut;
  }
}
