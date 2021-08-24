import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class GroupByBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('GroupByBlock', block, blockMutator);
    this.class = GroupByBlock;
  }

  defineBlock() {
    this.block
      .appendValueInput('afterGroupBy')
      .appendField('GROUP BY')
      .setCheck('attribut');

    this.block.setPreviousStatement(true, ['from_groupby', 'where_groupby']); // Was ist vorher erlaubt
    this.block.setNextStatement(true, ['groupby_having', 'groupby_orderby']);
    this.block.setColour(180);
    this.block.setInputsInline(true);
  }

  public toJavaScriptCode(block: GroupByBlock): string | any[] {
    var attr = Blockly.JavaScript.statementToCode(block, 'afterGroupBy');

    var code = 'GROUP BY ' + attr;

    return code;
  }
}
