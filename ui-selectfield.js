import xin from 'xin';
import html from './templates/ui-selectfield.html';

import './scss/ui-textfield.scss';

class UISelectfield extends xin.Component {
  get template () {
    return html;
  }

  get props () {
    return Object.assign({}, super.props, {
      value: {
        type: String,
        notify: true,
      },

      label: {
        type: String,
      },

      options: {
        type: Array,
        value: () => ([]),
        observer: 'optionsChanged(options)',
      },

      labelKey: {
        type: String,
        value: 'label',
      },

      valueKey: {
        type: String,
        value: 'value',
      },
    });
  }

  created () {
    super.created();

    this.classList.add('ui-textfield');
    this.classList.add('ui-textfield--stacked');
  }

  ready () {
    super.ready();

    this.optionsChanged(this.options);
  }

  optionsChanged (options) {
    if (!this.$.field) {
      return;
    }

    const fragment = document.createDocumentFragment();

    if (options.length > 0 && options[0][this.valueKey]) {
      let optEl = document.createElement('option');
      fragment.appendChild(optEl);
    }

    options.forEach(opt => {
      const optEl = document.createElement('option');
      optEl.value = opt[this.valueKey];
      optEl.innerHTML = opt[this.labelKey];
      fragment.appendChild(optEl);
    });

    this.$.field.innerHTML = '';
    this.$.field.appendChild(fragment);

    this.$.field.value = this.value || '';
  }
}

xin.define('ui-selectfield', UISelectfield);

export default UISelectfield;
