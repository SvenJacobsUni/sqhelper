import { BlockMutator, CustomBlock } from 'ngx-blockly';

declare var Blockly: any;

export class FromBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('FromBlock', block, blockMutator);
    this.class = FromBlock;
  }

  defineBlock() {
    this.block.setPreviousStatement(true, 'select_from');
    this.block.setNextStatement(true, [
      'from_where',
      'from_groupby',
      'from_orderby',
    ]);
    this.block.setColour(180);
    this.block.jsonInit({
      mutator: 'from_mutator',
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
{
        var attri = ""; // Wird zu Komma wenn zwei Table nacheinander im From -> impliziter Join wird ermöglicht
        if (c>0 && this.block.childBlocks_[c-1]!=null && this.block.childBlocks_[c]!=null)
        {
        if ((this.block.childBlocks_[c].blockInstance._type == "TableBlock") )
        {
         attri = ", "
        }
      }
          b[c] =
            attri + Blockly.JavaScript.statementToCode(
              a,
              'ADD' + c,
              Blockly.JavaScript.ORDER_COMMA
            ) || '';
            }
        a = b.join(''); // string der zwischen jeden From Attribut bzw Tabelle eingefügt
    }
    var temp = ['FROM' + a, Blockly.JavaScript.ORDER_FUNCTION_CALL];

    var code = '' + temp;
    code = code.substring(0, code.length - 2) + ' ';
    return code;
  }
}
