import { BuildArea } from '../../js/fb-build-area';
import { markup } from '../../js/utils';
import { BasicAPIProps } from '../config-properties/api-props/basic-api-properties';
import { ColumnsDisplayProps } from '../config-properties/display-props/layout-display-properties';
import { EditableGridValidationProps } from '../config-properties/validation-props/editable-validation-properties';
import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  LAYOUT_CONTROL_PROPS_TYPES,
} from '../utils/control-props-types';
import { LAYOUT_TYPES } from '../utils/layout-types';
import { RowBlock } from './row-block';

const defaultSettings = {
  columns: [
    {
      size: 'lg',
      width: 12,
    },
  ],
};

export class EditableGrid extends RowBlock {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props);
  }

  setup() {
    this.elementType = LAYOUT_TYPES.EDIT_GRID;

    this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] =
      this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] ||
      BuildArea.getInstance().generateAPIFieldName(this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT] ?? this.type);

    this.displayControlProps = new ColumnsDisplayProps(this.elementType, this.props);
    this.apiControlProps = new BasicAPIProps(LAYOUT_TYPES.EDIT_DROPABLE, this.props);
    this.validationControlProps = new EditableGridValidationProps(this.props);

    if (!this.initialSetupWithChildren()) {
      this.initialColumnsSetup();
    }
    this.children.forEach((child) => {
      child.props[LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION] = 'row';
      child.validationControlProps = new EditableGridValidationProps(this.props);
      child.displayControlProps.modifyPropValue(LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION, 'row');
    });
  }

  render(customProps, includeDropables = false) {
    const props = customProps ?? this.getPropsObject();
    const nodes = [];
    const label = props[CONTROL_PROPS_TYPES.LABEL];
    const hideLabel = props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    if (label && !hideLabel) {
      nodes.push(markup('label', label, { for: this.id, class: 'mt-2' }));
    }
    this.children.forEach((child) => {
      child.validationControlProps?.modifyPropValue(
        CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS,
        props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS],
      );
      child.validationControlProps?.modifyPropValue(
        CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS,
        props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS],
      );
    });
    return markup('div', [...nodes, super.render(customProps, includeDropables)], {
      class: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] || 'container',
    });
  }

  getFieldValues() {
    const props = this.getPropsObject();
    if (!props[CONTROL_API_PROPS_TYPES.FIELD_NAME] || !this.children.length) return {};
    return {
      [props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]: this.children[0].getFieldValues(),
    };
  }
}
