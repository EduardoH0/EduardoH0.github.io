import { EVENTS } from "./events.js";

export class LoadingHandler {
    constructor(selector = '.loading-element') {
        this.loadingDiv = document.querySelector(selector);
        this.timeout = 10000;
        this.timeoutId = null;
        this.timeoutFired = false;
        this.elements = null;

        this.loadedCount = 0;
        this.totalElements = 0;

        this.setTimeout();
    }

    setTimeout() {
        this.timeoutId = setTimeout(() => {
            console.warn("Timeout reached. Fading out...");
            this.timeoutFired = true;

            if (this.elements) {
                this.elements.forEach((el) => {
                    el.removeEventListener('load', this.checkAllElementsLoaded);
                });
            }

            this._fadeOut();
        }, this.timeout);
        
    }

    init() {
        if (!this.loadingDiv) {
            console.warn('Loading element not found.');
            return;
        }
        window.addEventListener('load', () => this._fadeOut());
    }

    _fadeOut() {
        if (this.timeoutId) { clearTimeout(this.timeoutId) }

        this.loadingDiv.classList.add('fade-out');

        // Remove div from the DOM once the transition is finished
        this.loadingDiv.addEventListener('transitionend', () => {
            if (this.loadingDiv.parentNode) {
                this.loadingDiv.parentNode.removeChild(this.loadingDiv);
            }
        });

        const event = new CustomEvent(EVENTS.CONTENT_LOADED);
        document.dispatchEvent(event);
    }

    checkElementLoading(selector) {
        this.elements = document.querySelectorAll(selector); // Elements to monitor
        this.totalElements = this.elements.length;

        if (this.totalElements === 0) {
            console.warn(`No elements found with the selector: ${selector}`);
            return;
        }

        this.elements.forEach((el) => {
            // Check if element is already loaded (e.g., cached or instant)
            if (el.complete) {
                this.checkAllElementsLoaded();
            } else {
                el.addEventListener('load', this.checkAllElementsLoaded);
            }
        });
    }

    checkAllElementsLoaded() {
        this.loadedCount++;
        if (this.loadedCount === this.totalElements) {

            console.log('All elements loaded')
            console.log(`N elements: ${this.totalElements}`)

            this.elements.forEach((el) => {
                el.removeEventListener('load', this.checkAllElementsLoaded);
            });

            if (!this.timeoutFired) this._fadeOut()
        }
    }
}