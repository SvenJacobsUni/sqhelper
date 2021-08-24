import { BlockMutator, CustomBlock } from 'ngx-blockly';
declare var Blockly: any;

export class DateBlock extends CustomBlock {
  constructor(block: any, blockMutator: BlockMutator) {
    super('DateBlock', block, blockMutator);
    this.class = DateBlock;
  }

  defineBlock() {
    this.block
      .appendDummyInput()
      .appendField('Jahr:')
      .appendField(new Blockly.FieldNumber(2018), 'date_year');
    this.block
      .appendDummyInput()
      .appendField('Monat:')
      .appendField(new Blockly.FieldNumber(0, 1, 12), 'date_month');
    this.block
      .appendDummyInput()
      .appendField('Tag:')
      .appendField(new Blockly.FieldNumber(0, 1, 31), 'date_day');

    this.block.setInputsInline(true);
    this.block.setOutput(true, 'date');
    this.block.setColour(300);
    this.block.setTooltip('');
    this.block.setHelpUrl('');
  }

  public toJavaScriptCode(block: DateBlock): string | any[] {
    var year = parseFloat(this.block.getFieldValue('date_year'));
    var month = parseFloat(this.block.getFieldValue('date_month'));
    var day = parseFloat(this.block.getFieldValue('date_day'));

    var year2 = '' + year;
    var month2 = ''+month;
    var day2 = ''+day;

    if (month < 10) {
      month2 = '0' + month;
    }
    if (day < 10) {
      day2 = '0' + day;
    }

    var code = "'" + year2 + '-' + month2 + '-' + day2 + "'";
    return code;
  }
}
