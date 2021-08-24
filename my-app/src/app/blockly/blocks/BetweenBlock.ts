import { BlockMutator, CustomBlock } from 'ngx-blockly';
import { globalvars } from 'src/app/globalvars';

declare var Blockly: any;

export class BetweenBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('BetweenBlock', block, blockMutator);
    this.class = BetweenBlock;
  }

  defineBlock() {
    this.block
    .appendDummyInput()
    .appendField(new Blockly.FieldDropdown(this.generateOptions), 'Attribut');
    this.block.appendValueInput('a')
    .appendField(
      new Blockly.FieldDropdown([
        ['\u2009', ''],
        ['NOT', 'NOT']
      ]),
      'not'
    )
    .appendField('BETWEEN')
    .setCheck(null)
    this.block.appendValueInput('b')
    .appendField('AND')
    .setCheck(null)
    this.block.setInputsInline(true);
    this.block.setColour(70);
    this.block.setOutput(true, 'between');
  }

  public toJavaScriptCode(block: any): string | any[] {
    var dropdown_Table = this.block.getFieldValue('Attribut');
    var dropdown_not = this.block.getFieldValue('not');
    var a = Blockly.JavaScript.statementToCode(block, 'a');
    var b = Blockly.JavaScript.statementToCode(block, 'b');
    return (dropdown_Table+ " "+dropdown_not+" BETWEEN "+a+" AND "+ b);
  }
  generateOptions() {
    return globalvars.Attribut;
  }
}
