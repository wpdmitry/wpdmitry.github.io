class Element {
    constructor(tag) {
        this.element = tag instanceof HTMLElement ? tag : document.createElement(tag);
    }

    getNativeElement() {
        const { element } = this;

        if (element instanceof Element) {
            return element.getNativeElement();
        }

        return element;
    }

    setText(text) {
        this.getNativeElement().textContent = text;
    }

    setStyles(styles) {
        Object.keys(styles).forEach(key => {
            this.getNativeElement().style[key] = styles[key];
        });
    }

    appendElements(...elements) {
        elements.forEach(element => {
            this.getNativeElement().appendChild(element.getNativeElement());
        })
    }

    on(eventName, callback) {
        this.getNativeElement().addEventListener(eventName, callback);
    }

    off(eventName, callback) {
        this.getNativeElement().removeEventListener(eventName, callback);
    }

    appendTo(root) {
        root.appendChild(this.getNativeElement());
    }

    getSize() {
        const { width: rawW, height: rawH } = window.getComputedStyle(this.getNativeElement());

        if (rawW && rawH) {
            const w = parseInt(rawW, 10);
            const h = parseInt(rawH, 10);
            return [w, h];
        }

        console.error('Не получается вычислить размеры элемента');
    }

    setAttrs(attrs) {
        Object.keys(attrs).forEach(key => {
            this.getNativeElement().setAttribute(key, attrs[key]);
        });
    }

    static createElement(tagName) {
        return new Element(tagName);
    };
}

export default Element;
