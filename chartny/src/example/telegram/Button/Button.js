import Element from '../Element';
class Button extends Element {
    constructor({ text } = {}) {
        super();
        this.element = Element.createElement('button');
        this.element.setStyles({
            border: 'none',
            backgroundColor: 'transparent',
            padding: 0,
            outline: 'none',
            cursor: 'pointer'
        });

        if (text) {
            this.element.setText(text);
        }
    }
}

export default Button;
