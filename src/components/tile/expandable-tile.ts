/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, property, customElement, LitElement } from 'lit-element';
import ChevronDown16 from '@carbon/icons/lib/chevron--down/16';
import settings from 'carbon-components/es/globals/js/settings';
import { FORM_ELEMENT_COLOR_SCHEME } from '../../globals/shared-enums';
import HostListener from '../../globals/decorators/host-listener';
import FocusMixin from '../../globals/mixins/focus';
import HostListenerMixin from '../../globals/mixins/host-listener';
import styles from './tile.scss';

const { prefix } = settings;

/**
 * Expandable tile.
 * @element bx-expandable-tile
 * @fires bx-expandable-tile-beingchanged
 *   The custom event fired before the expanded state is changed upon a user gesture.
 *   Cancellation of this event stops changing the user-initiated change in expanded state.
 * @fires bx-expandable-tile-changed - The custom event fired after a the expanded state is changed upon a user gesture.
 */
@customElement(`${prefix}-expandable-tile`)
class BXExpandableTile extends HostListenerMixin(FocusMixin(LitElement)) {
  @HostListener('click')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleClick = () => {
    const expanded = !this.expanded;
    const init = {
      bubbles: true,
      composed: true,
      detail: {
        expanded,
      },
    };
    const constructor = this.constructor as typeof BXExpandableTile;
    const beforeChangeEvent = new CustomEvent(constructor.eventBeforeChange, {
      ...init,
      cancelable: true,
    });
    if (this.dispatchEvent(beforeChangeEvent)) {
      this.expanded = expanded;
      const afterChangeEvent = new CustomEvent(constructor.eventChange, init);
      this.dispatchEvent(afterChangeEvent);
    }
  };

  /**
   * An assistive text for screen reader to announce, telling the collapsed state.
   */
  @property({ attribute: 'collapsed-assistive-text' })
  collapsedAssistiveText!: string;

  /**
   * The color scheme.
   */
  @property({ attribute: 'color-scheme', reflect: true })
  colorScheme = FORM_ELEMENT_COLOR_SCHEME.REGULAR;

  /**
   * An assistive text for screen reader to announce, telling the expanded state.
   */
  @property({ attribute: 'expanded-assistive-text' })
  expandedAssistiveText!: string;

  /**
   * `true` to expand this expandable tile.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  createRenderRoot() {
    return this.attachShadow({ mode: 'open', delegatesFocus: true });
  }

  render() {
    const { collapsedAssistiveText, expandedAssistiveText, expanded } = this;
    const assistiveText = expanded ? expandedAssistiveText : collapsedAssistiveText;
    return html`
      <button class="${prefix}--tile__chevron" aria-labelledby="icon">
        ${ChevronDown16({
          id: 'icon',
          alt: assistiveText,
          description: assistiveText,
          'aria-label': assistiveText,
        })}
      </button>
      <div class="${prefix}--tile-content">
        <slot></slot>
      </div>
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('expanded')) {
      const { expanded } = this;
      if (expanded) {
        this.style.maxHeight = '';
      } else {
        const aboveTheFoldContent = this.querySelector((this.constructor as typeof BXExpandableTile).selectorAboveTheFoldContent);
        if (aboveTheFoldContent) {
          const computedStyle = this.ownerDocument!.defaultView!.getComputedStyle(this, null);
          const height =
            aboveTheFoldContent.getBoundingClientRect().height +
            parseInt(computedStyle.getPropertyValue('padding-top'), 10) +
            parseInt(computedStyle.getPropertyValue('padding-bottom'), 10);
          this.style.maxHeight = `${height}px`;
        }
      }
    }
  }

  /**
   * A selector that will return the above-the-fold content.
   */
  static get selectorAboveTheFoldContent() {
    return `${prefix}-tile-above-the-fold-content`;
  }

  /**
   * The name of the custom event fired before the expanded state is changed upon a user gesture.
   * Cancellation of this event stops changing the user-initiated change in expanded state.
   */
  static get eventBeforeChange() {
    return `${prefix}-expandable-tile-beingchanged`;
  }

  /**
   * The name of the custom event fired after a the expanded state is changed upon a user gesture.
   */
  static get eventChange() {
    return `${prefix}-expandable-tile-changed`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXExpandableTile;
