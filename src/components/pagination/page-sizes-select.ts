import { html, property, query, customElement, LitElement } from 'lit-element';
import ChevronDown16 from '@carbon/icons/lib/chevron--down/16';
import settings from 'carbon-components/es/globals/js/settings';
import styles from './pagination.scss';

const { prefix } = settings;

/**
 * The select box for page sizes.
 */
@customElement(`${prefix}-page-sizes-select`)
class BXPageSizesSelect extends LitElement {
  @query('select')
  protected _selectNode!: HTMLSelectElement;

  /**
   * Unique ID used for ID refs.
   */
  protected _uniqueId = Math.random()
    .toString(36)
    .slice(2);

  /**
   * The element ID for the select box.
   */
  protected get _selectId() {
    const { id: elementId, _uniqueId: uniqueId } = this;
    return `__bx-ce-page-sizes-select_${elementId || uniqueId}`;
  }

  /**
   * Handles `change` event on the `<select>` to select page size.
   */
  protected _handleChange({ target }: Event) {
    const value = Number((target as HTMLSelectElement).value);
    this.dispatchEvent(
      new CustomEvent((this.constructor as typeof BXPageSizesSelect).eventAfterChange, {
        bubbles: true,
        composed: true,
        detail: {
          value,
        },
      })
    );
    this.value = value;
  }

  /**
   * Handles `slotchange` event for the `<slot>` for `<options>`.
   * @param event The event.
   */
  protected _handleSlotChange({ target }: Event) {
    const { _selectNode: selectNode } = this;
    while (selectNode.firstChild) {
      selectNode.removeChild(selectNode.firstChild);
    }
    ((target as HTMLSlotElement).assignedNodes() as HTMLOptionElement[]).forEach(item => {
      selectNode!.appendChild(item.cloneNode(true));
    });
  }

  /**
   * The label text. Corresponds to `label-text` attribute.
   */
  @property({ attribute: 'label-text' })
  labelText = 'Items per page:';

  /**
   * The value, working as the current page size. Corresponds to the attribute with the same name.
   */
  @property({ type: Number })
  value!: number;

  render() {
    const { labelText, value, _selectId: selectId, _handleChange: handleChange, _handleSlotChange: handleSlotChange } = this;
    return html`
      <label for="${selectId}_size" class="${prefix}--pagination__text">${labelText}<slot name="label-text"></slot></label>
      <div class="${prefix}--select__item-count">
        <select id="${selectId}_size" class="${prefix}--select-input" .value="${value}" @change=${handleChange}></select>
        ${ChevronDown16({ class: `${prefix}--select__arrow` })}
      </div>
      <div hidden><slot @slotchange="${handleSlotChange}"></slot></div>
    `;
  }

  /**
   * The name of the custom event fired after the page size is changed.
   */
  static get eventAfterChange() {
    return `${prefix}-page-sizes-select-changed`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXPageSizesSelect;
