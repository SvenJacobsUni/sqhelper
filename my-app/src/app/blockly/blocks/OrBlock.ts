import { BlockMutator, CustomBlock } from 'ngx-blockly';

declare var Blockly: any;

export class OrBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('OrBlock', block, blockMutator);
    this.class = OrBlock;
  }

  defineBlock() {
    this.block.setInputsInline(false);
    this.block.setColour(70);
    this.block.setOutput(true, 'or');
    this.block.jsonInit({
      mutator: 'or_mutator',
    });
  }

  public toJavaScriptCode(block: any): string | any[] {
    var a = block;

    switch (a.itemCount_) {
      case 0:
        return 'OR';
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

        a = b.join(' OR ');
    }
    var attr = Blockly.JavaScript.statementToCode(block, 'firstOr');
    var temp = [a, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    var code = ""+temp;
    code = '(' + attr + " OR "+ code.substring(0, code.length - 2) +')';
    return code;
  }
}
