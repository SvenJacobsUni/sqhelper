import { BlockMutator, CustomBlock } from 'ngx-blockly';
import { globalvars } from '../../globalvars';
declare var Blockly: any;

export class TableBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('TableBlock', block, blockMutator);
    this.class = TableBlock;
  }

  defineBlock() {
    this.block
      .appendDummyInput()
      .appendField(new Blockly.FieldDropdown(this.generateOptions), 'Table');
    this.block.setOutput(true, 'table');
    this.block.setColour(210);
    this.block.setTooltip('Tabellenname');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: TableBlock): string | any[] {

    var dropdown_Table = this.block.getFieldValue('Table');
    var code = '' + dropdown_Table;
    return code;
  }
  generateOptions() {
    return globalvars.Table;
  }
}
