import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class OrderByBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('OrderByBlock', block, blockMutator);
    this.class = OrderByBlock;
  }

  defineBlock() {
    this.block
      .appendValueInput('afterOrderBy')
      .appendField('ORDER BY')
      .setCheck(null);
    this.block.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ['\u2009', ''],
        ['ASC', 'ASC'],
        ['DESC', 'DESC'],
      ]),
      'OrderByType'
    );
    this.block.setPreviousStatement(true, [
      'orderby_where',
      'from_orderby',
      'having_orderby',
      'groupby_orderby',
    ]);
    this.block.setNextStatement(true, 'where');
    this.block.setColour(180);
    this.block.setInputsInline(true);
  }

  public toJavaScriptCode(block: OrderByBlock): string | any[] {
    var attr = Blockly.JavaScript.statementToCode(block, 'afterOrderBy');
    var dropdown_OrderBy_type = this.block.getFieldValue('OrderByType');
    var code = ' ORDER BY ' + attr + ' ' + dropdown_OrderBy_type;

    return code;
  }
}
