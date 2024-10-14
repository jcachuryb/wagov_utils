import Control from '../../../js/fb-control';
import { markup } from '../../../js/utils';
import { CONTROL_TYPES } from '../../utils/control-types';

export default class Label extends Control {
  constructor(text = '', attr = {}) {
    super(attr, {}, CONTROL_TYPES.BASIC);
    this.text = text;
    this.display = true;
  }

  render() {
    if (!this.display) {
      return '';
    }
    return markup('label', this.text, this.attr);
  }
}
