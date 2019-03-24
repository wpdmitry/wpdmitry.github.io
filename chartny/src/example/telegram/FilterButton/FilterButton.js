import Button from '../Button';
import Element from '../Element';
import checkIcon from './check-icon.svg';

export default class FilterButton extends Button {
    constructor({ text, color, active }) {
        super();
        this.color = color;
        this.element.setStyles({
            border: '1px solid rgba(199, 209, 227, 0.8)',
            padding: '6px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
        });

        this.iconElement = Element.createElement('span');
        this.iconElement.setStyles({
            width: '17px',
            height: '17px',
            borderRadius: '50%',
            border: `1px solid ${color}`,
            backgroundColor: active ? color : 'none',
            background: `$url${(checkIcon)}`,
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        this.img = Element.createElement('img');
        this.img.setAttrs({
            src: checkIcon,
            width: '10px',
            height: '10px'
        });
        this.iconElement.appendElements(this.img);

        this.textElement = Element.createElement('span');
        this.textElement.setText(text);

        this.element.appendElements(this.iconElement, this.textElement);
    }

    setActive(active) {
        this.iconElement.setStyles({
            backgroundColor: active ? this.color : 'white',
        });
    }
}
