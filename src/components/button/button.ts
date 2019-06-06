import settings from 'carbon-components/es/globals/js/settings';
import classnames from 'classnames';
import { html, property, customElement, LitElement } from 'lit-element';
import styles from './button.scss';

const { prefix } = settings;

/**
 * Button kinds.
 */
export enum BUTTON_KIND {
  /**
   * Primary button.
   */
  PRIMARY = 'primary',

  /**
   * Secondary button.
   */
  SECONDARY = 'secondary',

  /**
   * Tertiary button.
   */
  TERTIARY = 'tertiary',

  /**
   * Danger button.
   */
  DANGER = 'danger',

  /**
   * Ghost button.
   */
  GHOST = 'ghost',
}

/**
 * Button.
 */
@customElement(`${prefix}-btn` as any)
class BXButton extends LitElement {
  /**
   * Handles `click` event on the `<a>.
   * @param event The event.
   */
  private _handleClickLink = (event: MouseEvent) => {
    if (this.disabled) {
      event.preventDefault(); // Stop following the link
      event.stopPropagation(); // Stop firing `onClick`
    }
  };

  /**
   * `true` if the button should be disabled. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Link `href`. Corresponds to the attribute with the same name. If present, this button is rendered as `<a>`.
   */
  @property()
  href = '';

  /**
   * Button kind. Corresponds to the attribute with the same name.
   */
  @property({ reflect: true })
  kind = BUTTON_KIND.PRIMARY;

  /**
   * `true` if the button should be a small variant. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  small = false;

  createRenderRoot() {
    return this.attachShadow({ mode: 'open', delegatesFocus: true });
  }

  render() {
    const { disabled, href, kind, small } = this;
    const classes = classnames(`${prefix}--btn`, {
      [`${prefix}--btn--${kind}`]: kind,
      [`${prefix}--btn--disabled`]: disabled,
      [`${prefix}--btn--sm`]: small,
    });
    return href
      ? html`
          <a id="button" role="button" class="${classes}" href=${href} @click=${this._handleClickLink}><slot></slot></a>
        `
      : html`
          <button id="button" class="${classes}" ?disabled=${disabled}><slot></slot></button>
        `;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXButton;