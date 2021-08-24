import { BlockMutator, CustomBlock } from 'ngx-blockly';

declare var Blockly: any;

export class AndBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('AndBlock', block, blockMutator);
    this.class = AndBlock;
  }

  defineBlock() {
    this.block.setInputsInline(false);
    this.block.setColour(70);
    this.block.setOutput(true, 'and');
    this.block.jsonInit({
      mutator: 'and_mutator',
    });
  }

  public toJavaScriptCode(block: any): string | any[] {
    var a = block;

    switch (a.itemCount_) {
      case 0:
        return 'FROM';
      default:
        var b = Blockly.JavaScript.statementToCode(
          a,
          'ADD0',
          Blockly.JavaScript.ORDER_NONE
        );
        b = Array(a.itemCount_);
        for (var c = 0; c < a.itemCount_; c++)
          b[c] =
            Blockly.JavaScript.statementToCode(
              a,
              'ADD' + c,
              Blockly.JavaScript.ORDER_COMMA
            ) || '';

        a = b.join(' AND ');
    }

    var attr = Blockly.JavaScript.statementToCode(block, 'firstAnd');
    var temp = [a, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    var code = ""+temp;

        code = '(' + attr + " AND "+ code.substring(0, code.length - 2) +')';
        return code;

  }
}
