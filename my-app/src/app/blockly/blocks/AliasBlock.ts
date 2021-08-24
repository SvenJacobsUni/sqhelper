import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class AliasBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('AliasBlock', block, blockMutator);
    this.class = AliasBlock;
  }

  defineBlock() {
    this.block
      .appendValueInput('afterAlias')
      .setCheck(['innerselect', 'attribut', 'function','distinct']);
    this.block
      .appendDummyInput()
      .appendField('AS')
      .appendField(new Blockly.FieldTextInput('\u2009'), 'textInput');
    this.block.setOutput(true, 'alias');
    this.block.setColour(120);
    this.block.setInputsInline(true);
  }

  public toJavaScriptCode(block: AliasBlock): string | any[] {
    var attr = Blockly.JavaScript.statementToCode(block, 'afterAlias');
    var code = '';
    code = attr + ' AS ' + this.block.getFieldValue('textInput');
    return code;
  }
}
