import { DropableControl } from './dropable-control';
import { markup } from '../../js/utils';
import { MultiControlRenderer } from '../renderers/multivalue-renderer';
import { CONTROL_PROPS_TYPES, CONTROL_VALIDATION_PROPS_TYPES } from '../utils/control-props-types';
import { LAYOUT_TYPES } from '../utils/layout-types';
import { CLASS_INVALID_FIELD_VALUE } from '../utils/constants';

const defaultSettings = {};

export class EditableDropableControl extends DropableControl {
  constructor(attr = {}, props = {}) {
    super(attr, props);
    this.elementType = LAYOUT_TYPES.EDIT_DROPABLE;
  }

  addChildControl(control) {
    super.addChildControl(control);
  }

  removeChildControl(controlId) {
    super.removeChildControl(controlId);

    // re set rows
  }

  validateValue() {
    if (!this.validationControlProps) return true;
    const props = this.validationControlProps.getPropsValues();
    const values = this.getFieldValues();
    const errors = [];
    if (
      props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] &&
      props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] > 0 &&
      values.length < props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS]
    ) {
      const isOne = props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] === 1;
      errors.push(`You must add at least ${props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS]} item${isOne ? '' : 's'}`);
    }
    if (
      props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS] &&
      props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS] > 0 &&
      values.length > props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS]
    ) {
      const isOne = props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] === 1;
      errors.push(`You can only add up to ${props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS]} item${isOne ? '' : 's'}`);
    }

    let errorMessage = '';
    if (errors.length > 0) {
      errorMessage = props[CONTROL_VALIDATION_PROPS_TYPES.ERROR_MESSAGE] || errors.join(', ');
    }
    $(this.getIdSelector() + ` .${CLASS_INVALID_FIELD_VALUE}`)
      .last()
      .text(errorMessage);

    return errors.length === 0;
  }

  getFieldValues() {
    if (this.renderer) {
      return this.renderer.getValues();
    }
    return [];
  }

  toDisplay(parentContainer) {
    const props = this.displayControlProps.getPropsValues();

    const container = markup('div', this.dropableType, {
      class: [props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] || 'col', 'row', 'mb-3'].join(' '),
      id: this.id,
      'data-parentAreaId': this.parentAreaId,
      'data-areaId': this.areaId,
    });
    const invalidField = markup('div', '', { class: CLASS_INVALID_FIELD_VALUE });

    if (parentContainer) {
      parentContainer.append(container);
      this.renderer = new MultiControlRenderer(this, this.children, {
        ...this.validationControlProps.getPropsValues(),
      });
      container.append(this.renderer.render());
      this.renderer.afterRender();
    }
    container.append(invalidField);

    return container;
  }
}
