import * as Blockly from 'blockly';

const plusImage =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
  '9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMT' +
  'ggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNz' +
  'FjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MW' +
  'MwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS' +
  '44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==';

const minusImage =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAw' +
  'MC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPS' +
  'JNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAw' +
  'IDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K';

function onPlusClick(plusField: any): void {
  const block = plusField.getSourceBlock();
  if (!block) return;

  Blockly.Events.setGroup(true);

  const oldMutationDom = block.mutationToDom?.();
  const oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);

  block.plus?.(plusField.args_);

  const newMutationDom = block.mutationToDom?.();
  const newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);

  if (oldMutation !== newMutation) {
    Blockly.Events.fire(
      new Blockly.Events.BlockChange(block, 'mutation', null, oldMutation, newMutation)
    );
  }
  Blockly.Events.setGroup(false);
}

function onMinusClick(minusField: any): void {
  const block = minusField.getSourceBlock();
  if (!block) return;

  Blockly.Events.setGroup(true);

  const oldMutationDom = block.mutationToDom?.();
  const oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);

  block.minus?.(minusField.args_);

  const newMutationDom = block.mutationToDom?.();
  const newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);

  if (oldMutation !== newMutation) {
    Blockly.Events.fire(
      new Blockly.Events.BlockChange(block, 'mutation', null, oldMutation, newMutation)
    );
  }
  Blockly.Events.setGroup(false);
}

export function createPlusField(optArgs?: any): Blockly.FieldImage {
  const plus = new Blockly.FieldImage(plusImage, 15, 15, undefined, onPlusClick);
  (plus as any).args_ = optArgs;
  return plus;
}

export function createMinusField(optArgs?: any): Blockly.FieldImage {
  const minus = new Blockly.FieldImage(minusImage, 15, 15, undefined, onMinusClick);
  (minus as any).args_ = optArgs;
  return minus;
}
