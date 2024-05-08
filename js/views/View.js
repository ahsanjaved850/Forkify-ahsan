import icons from "url:/img/icons.svg"; //parcel 2

export default class View {
  _data;

  /**
   *
   * @param {object | object[]} data the data to be rendered e.g recipe
   * @param {boolean} [render] if false create markup string instead if rendering to dom
   * @returns {undefined | string} a markup is returned if render=false
   * @this {object} View instance
   * @author Ahsan Javed
   * @todo finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // update cahnged text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }
      // update changed attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((att) => {
          curEl.setAttribute(att.name, att.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const html = `
          <div class="spinner">
              <svg>
                  <use href="${icons}#icon-loader"></use>
              </svg>
          </div>
          `;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
