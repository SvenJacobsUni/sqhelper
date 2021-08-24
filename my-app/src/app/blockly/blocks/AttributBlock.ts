import { BlockMutator, CustomBlock } from 'ngx-blockly';
import { globalvars } from '../../globalvars';
declare var Blockly: any;

export class AttributBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('AttributBlock', block, blockMutator);
    this.class = AttributBlock;
  }

  defineBlock() {
    this.block
      .appendDummyInput()
      .appendField(new Blockly.FieldDropdown(this.generateOptions), 'Attribut');
    this.block.setOutput(true, 'attribut');
    this.block.setColour(120);
    this.block.setTooltip('Eine Spalte aus einer Tabelle');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: AttributBlock): string | any[] {
    var dropdown_attribut = this.block.getFieldValue('Attribut');
    var code = '' + dropdown_attribut;
    return code;
  }
  generateOptions() {
    return globalvars.Attribut;
  }
}
