import xin from 'xin';
import html from './templates/ui-snackbar.html';

import './scss/ui-snackbar.scss';

const container = (() => {
  let container = document.querySelector('div.ui-snackbar__container');
  if (container) {
    return container;
  }

  container = document.createElement('div');
  container.classList.add('ui-snackbar__container');
  document.body.appendChild(container);

  return container;
})();

class UISnackbar extends xin.Component {
  static create (options) {
    return new Promise(resolve => {
      const bar = document.createElement('ui-snackbar');
      setTimeout(() => {
        bar.all(options);
        resolve(bar);
      });
    });
  }

  static async show (options) {
    const bar = await UISnackbar.create(options);
    return await bar.show();
  }

  get props () {
    return Object.assign({}, super.props, {
      message: {
        type: String,
        value: '',
      },

      timeout: {
        type: Number,
        value: 2700,
      },

      actionHandler: {
        type: Function,
      },

      actionText: {
        type: String,
        value: '',
      },
    });
  }

  get template () {
    return html;
  }

  created () {
    super.created();

    this.classList.add('ui-snackbar');
  }

  async show () {
    container.appendChild(this);

    await new Promise((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;

      this.async(() => {
        this.classList.add('ui-snackbar--active');

        if (this.timeout > 0) {
          this.async(this.hide, this.timeout);
        }
      }, 50);
    });
  }

  async hide () {
    this.classList.remove('ui-snackbar--active');

    await new Promise(resolve => {
      this.once('transitionend', resolve);
    });

    container.removeChild(this);

    this.resolveCallback();
  }

  actionClicked (evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();

    if (typeof this.actionHandler === 'function') {
      this.actionHandler();
    }
  }
}

xin.define('ui-snackbar', UISnackbar);

export default UISnackbar;
