import { BlockMutator, CustomBlock } from 'ngx-blockly';

declare var Blockly: any;

export class SelectBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('SelectBlock', block, blockMutator);
    this.class = SelectBlock;
  }

  defineBlock() {
    this.block.setPreviousStatement(true, 'select_innerselect');
    this.block.setNextStatement(true, 'select_from');
    this.block.setColour(180);
    this.block.jsonInit({
      mutator: 'select_mutator',
    });
  }

  public toJavaScriptCode(block: any): string | any[] {
    var a = block;

    switch (a.itemCount_) {
      case 0:
        return 'SELECT';
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

        a = b.join(',');
    }
    var temp = ['SELECT' + a, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    var code = '' + temp;
    code = code.substring(0, code.length - 2) + ' ';
    return code;
  }
}
