import * as Blockly from 'blockly';
import { createPlusField, createMinusField } from './field-helpers';

// SELECT Mutator
const selectMutator = {
  itemCount_: 0,
  topInput_: null as any,

  mutationToDom(this: any): Element {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation(this: any, xmlElement: Element): void {
    const targetCount = parseInt(xmlElement.getAttribute('items') || '0', 10);
    this.updateShape_(targetCount);
  },

  updateShape_(this: any, targetCount: number): void {
    while (this.itemCount_ < targetCount) {
      this.addPart_();
    }
    while (this.itemCount_ > targetCount) {
      this.removePart_();
    }
    this.updateMinus_();
  },

  plus(this: any): void {
    this.addPart_();
    this.updateMinus_();
  },

  minus(this: any): void {
    if (this.itemCount_ === 1) return;
    this.removePart_();
    this.updateMinus_();
  },

  addPart_(this: any): void {
    if (this.itemCount_ === 0) {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }
      this.topInput_ = this.appendValueInput('ADD' + this.itemCount_)
        .appendField(createPlusField(), 'PLUS')
        .appendField('SELECT')
        .setCheck(['attribut', 'alias', 'function', 'distinct']);
    } else {
      this.appendValueInput('ADD' + this.itemCount_)
        .setCheck(['attribut', 'alias', 'function']);
    }
    this.itemCount_++;
  },

  removePart_(this: any): void {
    this.itemCount_--;
    this.removeInput('ADD' + this.itemCount_);
    if (this.itemCount_ === 0) {
      this.topInput_ = this.appendDummyInput('EMPTY')
        .appendField(createPlusField(), 'PLUS')
        .appendField('SELECT');
    }
  },

  updateMinus_(this: any): void {
    const minusField = this.getField('MINUS');
    if (!minusField && this.itemCount_ > 0) {
      this.topInput_.insertFieldAt(1, createMinusField(), 'MINUS');
    } else if (minusField && this.itemCount_ < 1) {
      this.topInput_.removeField('MINUS');
    }
  },
};

// FROM Mutator
const fromMutator = {
  itemCount_: 0,
  topInput_: null as any,

  mutationToDom(this: any): Element {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation(this: any, xmlElement: Element): void {
    const targetCount = parseInt(xmlElement.getAttribute('items') || '0', 10);
    this.updateShape_(targetCount);
  },

  updateShape_(this: any, targetCount: number): void {
    while (this.itemCount_ < targetCount) {
      this.addPart_();
    }
    while (this.itemCount_ > targetCount) {
      this.removePart_();
    }
    this.updateMinus_();
  },

  plus(this: any): void {
    this.addPart_();
    this.updateMinus_();
  },

  minus(this: any): void {
    if (this.itemCount_ === 1) return;
    this.removePart_();
    this.updateMinus_();
  },

  addPart_(this: any): void {
    if (this.itemCount_ === 0) {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }
      this.topInput_ = this.appendValueInput('ADD' + this.itemCount_)
        .appendField(createPlusField(), 'PLUS')
        .appendField('FROM')
        .setCheck(['table', 'alias']);
    } else {
      this.appendValueInput('ADD' + this.itemCount_)
        .setCheck(['table', 'join', 'alias']);
    }
    this.itemCount_++;
  },

  removePart_(this: any): void {
    this.itemCount_--;
    this.removeInput('ADD' + this.itemCount_);
    if (this.itemCount_ === 0) {
      this.topInput_ = this.appendDummyInput('EMPTY')
        .appendField(createPlusField(), 'PLUS')
        .appendField('FROM');
    }
  },

  updateMinus_(this: any): void {
    const minusField = this.getField('MINUS');
    if (!minusField && this.itemCount_ > 0) {
      this.topInput_.insertFieldAt(1, createMinusField(), 'MINUS');
    } else if (minusField && this.itemCount_ < 1) {
      this.topInput_.removeField('MINUS');
    }
  },
};

// AND Mutator
const andMutator = {
  itemCount_: 0,
  topInput_: null as any,

  mutationToDom(this: any): Element {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation(this: any, xmlElement: Element): void {
    const targetCount = parseInt(xmlElement.getAttribute('items') || '0', 10);
    this.updateShape_(targetCount);
  },

  updateShape_(this: any, targetCount: number): void {
    while (this.itemCount_ < targetCount) {
      this.addPart_();
    }
    while (this.itemCount_ > targetCount) {
      this.removePart_();
    }
    this.updateMinus_();
  },

  plus(this: any): void {
    this.addPart_();
    this.updateMinus_();
  },

  minus(this: any): void {
    if (this.itemCount_ === 1) return;
    this.removePart_();
    this.updateMinus_();
  },

  addPart_(this: any): void {
    if (this.itemCount_ === 0) {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }
      this.topInput_ = this.appendValueInput('ADD' + this.itemCount_)
        .appendField(createPlusField(), 'PLUS')
        .setCheck(['operand', 'and', 'or', 'between', 'not', 'in']);
      this.appendValueInput('firstAnd')
        .appendField('AND')
        .setCheck(['operand', 'and', 'or', 'between', 'not', 'in']);
    } else {
      this.appendValueInput('ADD' + this.itemCount_)
        .appendField('AND')
        .setCheck(['operand', 'and', 'or', 'between', 'not', 'in']);
    }
    this.itemCount_++;
  },

  removePart_(this: any): void {
    this.itemCount_--;
    this.removeInput('ADD' + this.itemCount_);
    if (this.itemCount_ === 0) {
      this.topInput_ = this.appendDummyInput('EMPTY')
        .appendField(createPlusField(), 'PLUS');
    }
  },

  updateMinus_(this: any): void {
    const minusField = this.getField('MINUS');
    if (!minusField && this.itemCount_ > 0) {
      this.topInput_.insertFieldAt(1, createMinusField(), 'MINUS');
    } else if (minusField && this.itemCount_ < 1) {
      this.topInput_.removeField('MINUS');
    }
  },
};

// OR Mutator
const orMutator = {
  itemCount_: 0,
  topInput_: null as any,

  mutationToDom(this: any): Element {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation(this: any, xmlElement: Element): void {
    const targetCount = parseInt(xmlElement.getAttribute('items') || '0', 10);
    this.updateShape_(targetCount);
  },

  updateShape_(this: any, targetCount: number): void {
    while (this.itemCount_ < targetCount) {
      this.addPart_();
    }
    while (this.itemCount_ > targetCount) {
      this.removePart_();
    }
    this.updateMinus_();
  },

  plus(this: any): void {
    this.addPart_();
    this.updateMinus_();
  },

  minus(this: any): void {
    if (this.itemCount_ === 1) return;
    this.removePart_();
    this.updateMinus_();
  },

  addPart_(this: any): void {
    if (this.itemCount_ === 0) {
      if (this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      }
      this.topInput_ = this.appendValueInput('ADD' + this.itemCount_)
        .appendField(createPlusField(), 'PLUS')
        .setCheck(['operand', 'and', 'or', 'between', 'not', 'in']);
      this.appendValueInput('firstOr')
        .appendField('OR')
        .setCheck(['operand', 'and', 'or', 'between', 'not', 'in']);
    } else {
      this.appendValueInput('ADD' + this.itemCount_)
        .appendField('OR')
        .setCheck(['operand', 'and', 'or', 'between', 'not', 'in']);
    }
    this.itemCount_++;
  },

  removePart_(this: any): void {
    this.itemCount_--;
    this.removeInput('ADD' + this.itemCount_);
    if (this.itemCount_ === 0) {
      this.topInput_ = this.appendDummyInput('EMPTY')
        .appendField(createPlusField(), 'PLUS');
    }
  },

  updateMinus_(this: any): void {
    const minusField = this.getField('MINUS');
    if (!minusField && this.itemCount_ > 0) {
      this.topInput_.insertFieldAt(1, createMinusField(), 'MINUS');
    } else if (minusField && this.itemCount_ < 1) {
      this.topInput_.removeField('MINUS');
    }
  },
};

// Register all mutators
export function registerMutators(): void {
  if (!Blockly.Extensions.isRegistered('select_mutator')) {
    Blockly.Extensions.registerMutator('select_mutator', selectMutator);
  }
  if (!Blockly.Extensions.isRegistered('from_mutator')) {
    Blockly.Extensions.registerMutator('from_mutator', fromMutator);
  }
  if (!Blockly.Extensions.isRegistered('and_mutator')) {
    Blockly.Extensions.registerMutator('and_mutator', andMutator);
  }
  if (!Blockly.Extensions.isRegistered('or_mutator')) {
    Blockly.Extensions.registerMutator('or_mutator', orMutator);
  }
}
