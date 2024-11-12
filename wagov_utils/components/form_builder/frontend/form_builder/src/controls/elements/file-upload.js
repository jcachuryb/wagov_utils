import { formatFileSize, generateRandomId, markup, parseFileSize } from '../../js/utils';
import { CLASS_INVALID_FIELD_VALUE } from '../utils/constants';
import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  FILE_DATA_PROPS_TYPES,
} from '../utils/control-props-types';
import { ELEMENT_TYPES } from '../utils/element-types';
import InputElement from './input-element';

const defaultSettings = {
  type: 'text',
  value: '',
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
  [FILE_DATA_PROPS_TYPES.FILE_TYPES]: [
    { label: 'Tipo 1', value: 'asdasd' },
    { label: 'Tipo 2 ', value: 'asdac' },
    { label: 'Tipo 3', value: 'asdasxxxd' },
  ],
  [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
  [FILE_DATA_PROPS_TYPES.DISPLAY_AS_IMAGES]: true,
};

export default class FileUploadElement extends InputElement {
  files = [];
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props);
    this.elementType = ELEMENT_TYPES.FILE_UPLOAD;
    this.setup();
  }

  getFieldValue() {
    if (!this.apiControlProps) return {};
    const props = this.getPropsObject();
    let values = [];
    if (props[FILE_DATA_PROPS_TYPES.FILE_TYPES]) {
      values = this.files.map((file) => {
        return {
          [file.fileType]: file,
        };
      });
    } else {
      values = this.files;
    }

    return {
      [props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]: values,
    };
  }
  validateValue() {
    const props = this.getPropsObject();

    const errors = [];
    let errorMessage = '';
    if (props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED] && this.files.length === 0) {
      errors.push('At least one file is required');
    }
    if (props[FILE_DATA_PROPS_TYPES.FILE_TYPES] && this.files.some((file) => !file.fileType)) {
      errors.push('All files must have a type');
    }
    if (errors.length > 0) {
      errorMessage = props[CONTROL_VALIDATION_PROPS_TYPES.ERROR_MESSAGE] || errors.join(', ');
    }
    $(this.getIdSelector()).parent().find(`.${CLASS_INVALID_FIELD_VALUE}`).text(errorMessage);

    return errors.length === 0;
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    this.modifyProps(props);
    const value = props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
    const attributes = {
      id: props.id ?? this.id,
      type: this.type,
      value: value,
      hidden: true,
    };

    if (props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) attributes.required = true;

    if (props[CONTROL_PROPS_TYPES.DISABLED]) attributes.disabled = true;

    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.label.required = props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED] === true;
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];
    const isMultipleFiles = props[FILE_DATA_PROPS_TYPES.MULTIPLE_FILES];
    const isDisabled = props[CONTROL_PROPS_TYPES.DISABLED];
    const message = isMultipleFiles ? 'Drop files to attach or ' : 'Drop a file to attach or ';
    const content = [
      super.render(props, { hidden: true, ...(isMultipleFiles ? { multiple: true } : {}) }),
      markup(
        'div',
        [
          { tag: 'i', class: 'bi bi-cloud-upload-fill' },
          { tag: 'span', content: `&nbsp;${message}&nbsp` },
          {
            tag: 'a',
            class: isDisabled ? 'pe-none' : '',
            content: 'browse.',
            href: '#',
          },
        ],
        { class: 'file-selector' },
      ),
      markup('div', '', { class: CLASS_INVALID_FIELD_VALUE }),
      markup('div', [], { class: 'files-list', style: 'display: none;' }),
    ];

    return markup('div', content, {
      id: this.id + '-container',
      class: ['filecontainer', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''].join(' '),
    });
  }

  renderTest() {
    this.files.splice(0, this.files.length);
    const file = {
      id: 'test-file',
      name: 'test.pdf',
      size: 12345,
      type: 'application/pdf',
      base64: 'data:application/pdf;base64,',
    };
    this.files.push(file);
    this.renderFile(file);
  }

  afterRender() {
    if (!this.$p) {
      console.error('Element not rendered');
      return;
    }
    this.renderTest();
    const container = `#${this.id}-container`;
    $(`${container} a`).on('click', this, (e) => e.data.$p.find(`#${this.id}`).trigger('click'));
    // $(`${container} input[type="file"]`).on('change', this, this.handleFileInputChange.bind(this));
    $(`${container} input[type="file"]`).on('change', (e) => {
      console.log('change', e.target.files);
    });
    const fileSelector = $(`${container} .file-selector`);

    fileSelector.on('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).addClass('dragover');
    });
    fileSelector.on('dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    fileSelector.on('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).removeClass('dragover');
    });
    fileSelector.on('drop', this, function (e) {
      const _this = e.data;
      e.preventDefault();
      e.stopPropagation();
      $(this).removeClass('dragover');
      const ev = e.originalEvent;
      if (ev.dataTransfer.items) {
        [...ev.dataTransfer.items].forEach((item, i) => {
          if (item.kind === 'file') {
            const file = item.getAsFile();
            _this.processFile(file);
          }
        });
      } else {
        [...ev.dataTransfer.files].forEach((file, i) => {
          _this.processFile(file);
        });
      }
    });
  }

  handleFileInputChange(e) {
    const files = $(e.target).prop('files');
    if (!files || files.length === 0) return;
    for (const file of files) {
      this.processFile(file);
    }
  }

  processFile(file) {
    const _this = this;
    const props = this.dataControlProps.getPropsValues();
    if (props[CONTROL_PROPS_TYPES.DISABLED]) return;
    try {
      const fileData = {
        id: _this.id + '-file-' + generateRandomId(),
        name: file.name,
        size: file.size,
        type: file.type,
        fileType: '',
      };
      const parsedMaxSize = parseFileSize(props[FILE_DATA_PROPS_TYPES.FILE_MAX_SIZE]);
      const parsedMinSize = parseFileSize(props[FILE_DATA_PROPS_TYPES.FILE_MIN_SIZE]);
      if (parsedMaxSize && file.size > parsedMaxSize) {
        return alert(
          'File size exceeds the maximum allowed: ' + props[FILE_DATA_PROPS_TYPES.FILE_MAX_SIZE].toUpperCase(),
        );
      }
      if (parsedMinSize && file.size < parsedMinSize) {
        return alert('File must be larger than ' + props[FILE_DATA_PROPS_TYPES.FILE_MAX_SIZE].toUpperCase());
      }
      if (!props[FILE_DATA_PROPS_TYPES.MULTIPLE_FILES]) {
        _this.files = [];
        $(`#${this.id}-container .files-list`).empty();
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const base64String = event.target.result;
        fileData.base64 = base64String;
        _this.files.push(fileData);
        _this.renderFile(fileData);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file', error);
    }
  }

  renderFile(fileData) {
    const props = this.dataControlProps.getPropsValues();
    const fileExt = fileData.name.split('.').pop().toLowerCase();

    const renderAsImage = props[FILE_DATA_PROPS_TYPES.DISPLAY_AS_IMAGES] && fileData.type.startsWith('image/');
    const fileElement = markup(
      'row',
      [
        {
          tag: 'div',
          content: [
            renderAsImage
              ? { tag: 'img', src: fileData.base64, class: 'img-preview' }
              : { tag: 'img', src: `../../images/file-extension-icons/48px/${fileExt}.png` },
            { tag: 'span', content: fileData.name, class: 'ms-3' },
          ],
          class: 'd-flex col-xs-12 col-md-8 align-self-start gx-2',
        },
        {
          tag: 'div',
          content: [
            this.renderFileTypeSelect(fileData.id),
            { tag: 'span', content: `${formatFileSize(fileData.size)}`, class: 'col align-self-center text-center' },
            {
              tag: 'button',
              content: { tag: 'i', class: 'bi bi-trash' },
              class: 'btn btn-sm  btn-outline-danger flex-shrink-0 me-2',
              'data-file-id': fileData.id,
            },
          ],
          class: 'd-flex col-sm-xs col-md-4 align-self-center gx-2',
        },
      ],
      { id: fileData.id, class: 'd-flex text-body-secondary py-2 border-bottom' },
    );
    $(`#${this.id}-container .files-list`).show().append(fileElement);
    $(`#${fileData.id} button`).on('click', this, function (e) {
      const _this = e.data;
      const fileId = $(this).data('file-id');
      _this.files = _this.files.filter((f) => f.id !== fileId);
      $(`#${fileData.id}`).remove();
    });
    $(`#${fileData.id} select`).on('change', this, function (e) {
      const _this = e.data;
      const fileId = $(this).data('file-id');
      const file = _this.files.find((f) => f.id === fileId);
      if (file) file.fileType = $(this).val();
    });
  }

  renderFileTypeSelect(fileId) {
    const props = this.dataControlProps.getPropsValues();
    const types = props[FILE_DATA_PROPS_TYPES.FILE_TYPES] || [];
    const options = [{ tag: 'option', content: '', value: '' }];
    options.push(types.map((fileType) => markup('option', fileType.label, { value: fileType.value })));
    if (options.length === 0) {
      return '';
    }
    return markup('select', options, {
      id: this.id + '-file-type',
      class: 'form-select form-select-sm col',
      'data-file-id': fileId,
    });
  }
}
