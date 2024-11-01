import { CONTROL_VALIDATION_PROPS_TYPES } from '../../utils/control-props-types';

export const validationPropertiesStore = {
  [CONTROL_VALIDATION_PROPS_TYPES.VALIDATE_ON]: {
    name: 'validateOn',
    title: 'Validate On',
    type: 'string',
    required: false,
    options: [
      { value: 'blur', label: 'Blur' },
      { value: 'change', label: 'Change' },
      { value: 'submit', label: 'Submit' },
    ],
    value: 'blur',
    addEmptyOption: true,
  },
  [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: {
    name: 'required',
    title: 'Required',
    type: 'boolean',
    required: false,
    options: undefined,
    value: false,
  },
  [CONTROL_VALIDATION_PROPS_TYPES.UNIQUE]: {
    name: 'unique',
    title: 'Unique',
    type: 'boolean',
    required: false,
    options: undefined,
    value: false,
  },
  [CONTROL_VALIDATION_PROPS_TYPES.VALIDATE_HIDDEN]: {
    name: 'validateHidden',
    title: 'Validate Hidden',
    type: 'boolean',
    required: false,
    options: undefined,
    value: false,
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH]: {
    name: 'minLength',
    title: 'Min Length',
    type: 'number',
    placeholder: 'Enter a min length',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH]: {
    name: 'maxLength',
    title: 'Max Length',
    type: 'number',
    placeholder: 'Enter a max length',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MIN_VALUE]: {
    name: 'minValue',
    title: 'Min Value',
    type: 'number',
    placeholder: 'Enter a min value',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MAX_VALUE]: {
    name: 'maxValue',
    title: 'Max Value',
    type: 'number',
    placeholder: 'Enter a max value',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.REGEX]: {
    name: 'regex',
    title: 'Regex',
    type: 'string',
    placeholder: 'Enter a regex',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.ERROR_LABEL]: {
    name: 'errorLabel',
    title: 'Error Label',
    type: 'string',
    placeholder: 'Enter an error label',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.ERROR_MESSAGE]: {
    name: 'errorMessage',
    title: 'Error Message',
    type: 'string',
    placeholder: 'Enter an error message',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]: {
    name: 'minDate',
    title: 'Min Date',
    type: 'date',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]: {
    name: 'maxDate',
    title: 'Max Date',
    type: 'date',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED]: {
    name: 'minChecked',
    title: 'Min Checked',
    type: 'number',
    placeholder: '',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED]: {
    name: 'maxChecked',
    title: 'Max Checked',
    type: 'number',
    placeholder: '',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED_ERROR_MESSAGE]: {
    name: 'minCheckedErrorMessage',
    title: 'Min Checked Error Message',
    type: 'string',
    placeholder: '',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED_ERROR_MESSAGE]: {
    name: 'maxCheckedErrorMessage',
    title: 'Max Checked Error Message',
    type: 'string',
    placeholder: '',
    required: false,
    options: undefined,
    value: '',
  },
};
