import { Tooltip } from 'bootstrap';
import { DATE_DATA_PROPS_TYPES } from '../controls/utils/control-props-types';

/**
 * Generate a random id of up to 10 characters
 * @return {string} random id
 */
export const generateRandomId = () => {
  return Math.random().toString(36).slice(2, 10);
};

/**
 * recursively flatten a nested array
 * @param {Array} arr to be flattened
 * @return {Array} flattened array
 */
export const flattenArray = (arr) =>
  arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val), []);

/**
 * Convert strings into lowercase-hyphen
 *
 * @param  {string} str
 * @return {string}
 */
export const hyphenCase = (str) => {
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/[^\w\s\-]/gi, '');
  str = str.replace(/([A-Z])/g, function ($1) {
    return '-' + $1.toLowerCase();
  });

  return str.replace(/\s/g, '-').replace(/^-+/g, '');
};
export const safeAttrName = (name) => {
  const safeAttr = {
    className: 'class',
  };

  return safeAttr[name] || hyphenCase(name);
};

export const camelCase = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

export const compareMinMaxIntegers = (min, max) => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) return false;
  return min > max;
};

export const isPotentiallyDangerousAttribute = (attrName, attrValue) => {
  if (sanitizerConfig.backendOrder.length === 0) {
    //All backends disabled so no sanitization checks to be performed
    return false;
  }
  const attrNameLc = attrName.toLowerCase();
  attrValue = attrValue ? attrValue + '' : '';
  return (
    attrNameLc.startsWith('on') ||
    ['form', 'formaction'].includes(attrNameLc) ||
    attrValue.trim().toLowerCase().startsWith('javascript:')
  );
};

export const setElementContent = (element, content, asText = false) => {
  if (asText) {
    element.textContent = content;
  } else {
    element.innerHTML = content;

    return element;
  }
};

/**
 * Determine content type
 * @param  {Node | String | Array | Object} content
 * @return {string}
 */
export const getContentType = (content) => {
  if (content === undefined) {
    return content;
  }

  return [
    ['array', (content) => Array.isArray(content)],
    ['node', (content) => content instanceof window.Node || content instanceof window.HTMLElement],
    ['component', () => content && content.dom],
    [typeof content, () => true],
  ].find((typeCondition) => typeCondition[1](content))[0];
};

/**
 * Bind events to an element
 * @param  {EventTarget} element DOM element
 * @param  {Object} events  object full of events eg. {click: evt => callback}
 * @return {void}
 */
export const bindEvents = (element, events) => {
  if (events) {
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const eventObjType = getContentType(events[event]);
        if (eventObjType === 'function') {
          element.addEventListener(event, (evt) => events[event](evt));
        } else if (eventObjType === 'object') {
          const { fn, ...options } = events[event];
          $(element).on(event, options, fn);
        }
      }
    }
  }
};

/**
 * Generate markup wrapper where needed
 *
 * @param  {string} tag Tag name
 * @param  {string|Array|object|Node|Function|null} content content to wrap
 * @param  {Object} attributes attributes to assign to element
 * @return {HTMLElement} DOM Element
 */
export const markup = function (tag, content = '', attributes = {}) {
  let contentType = getContentType(content);
  const { events, ...attrs } = attributes;
  const field = document.createElement(tag);

  const appendContent = {
    string: (content) => {
      setElementContent(field, field.innerHTML + content);
    },
    object: (config) => {
      const { tag, content, ...data } = config;
      return field.appendChild(markup(tag, content, data));
    },
    node: (content) => {
      return field.appendChild(content);
    },
    array: (content) => {
      for (let i = 0; i < content.length; i++) {
        contentType = getContentType(content[i]);
        appendContent[contentType](content[i]);
      }
    },
    function: (content) => {
      content = content();
      contentType = getContentType(content);
      appendContent[contentType](content);
    },
    undefined: () => {},
  };

  for (const attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      const name = safeAttrName(attr);
      if (Array.isArray(attrs[attr])) {
        debugger;
      }
      let attrVal = Array.isArray(attrs[attr]) ? unique(attrs[attr].join(' ').split(' ')).join(' ') : attrs[attr];

      if (typeof attrVal === 'boolean') {
        if (attrVal === true) {
          const val = name === 'contenteditable' ? true : name;
          field.setAttribute(name, val);
        }
      } else {
        /* if (name === 'id' || name === 'name') {
          attrVal = sanitizeNamedAttribute(attrVal);
        } */
        if (attrVal !== undefined) {
          field.setAttribute(name, attrVal);
        }
      }
    }
  }

  if (content) {
    appendContent[contentType](content);
  }

  bindEvents(field, events);

  return field;
};

export const unique = (array) => {
  return array.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
};

export const activateTooltips = (parent, selector = '') => {
  if (!parent) return;
  if (parent instanceof $) parent = parent[0];

  const tooltipTriggerList = parent.querySelectorAll((selector ?? '').concat(' [data-bs-toggle="tooltip"]'));
  [...tooltipTriggerList].map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
};

export const getDatepickerOptionsFromProps = (props) => {
  const options = {
    changeMonth: true,
    changeYear: true,
  };
  if (props[DATE_DATA_PROPS_TYPES.DISABLE_WEEKENDS] == true) {
    options.beforeShowDay = $.datepicker.noWeekends;
  }

  return options;
};
