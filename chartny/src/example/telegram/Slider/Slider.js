import Element from '../Element';

class Border extends Element {
    constructor() {
        super();
        this.element = Element.createElement('div');
        this.element.setStyles({
            height: '100%',
            width: '5px'
        });
    }
}

class Slider extends Element {
    constructor({ bounds, onChangeBounds }) {
        super();
        this.bounds = bounds;
        this.onChangeBounds = onChangeBounds;

        this.element = Element.createElement('div');
        this.element.setStyles({
            height: '100%',
            width: '100%',
            display: 'flex'
        });

        this.movingBox = Element.createElement('div');
        this.movingBox.setStyles({
            flex: '1 0',
            borderTop: '2px solid rgba(199, 209, 227, 0.8)',
            borderBottom: '2px solid rgba(199, 209, 227, 0.8)',
            boxSizing: 'border-box',
            height: '100%',
            backgroundColor: 'transparent',
            position: 'relative',
            cursor: 'pointer'
        });

        let drag = false;
        let startX;
        let width;
        this.movingBox.on('mousedown', e => {
            width = this.getSize()[0];
            const { screenX } = e;
            drag = true;
            startX = screenX;
        });
        document.addEventListener('mousemove', e => {
            if (!drag) {
                return;
            }

            const { screenX } = e;
            const delta = (screenX - startX) / width;
            startX = screenX;
            const [left, right] = this.getBounds();
            const newLeft = left + delta;
            const newRight = right + delta;

            if (newLeft > 0 && newRight < 1) {
                this.setBounds([newLeft, newRight]);
            }
        });
        document.addEventListener('mouseup', e => {
            drag = false;
        });

        this.movingBox.on('touchstart', e => {
            width = this.getSize()[0];
            const { screenX } = e.changedTouches[0];
            drag = true;
            startX = screenX;
        });
        document.addEventListener('touchmove', e => {
            if (!drag) {
                return;
            }

            const { screenX } = e.changedTouches[0];
            const delta = (screenX - startX) / width;
            startX = screenX;
            const [left, right] = this.getBounds();
            const newLeft = left + delta;
            const newRight = right + delta;

            if (newLeft > 0 && newRight < 1) {
                this.setBounds([newLeft, newRight]);
            }
        });
        document.addEventListener('touchend', e => {
            drag = false;
        });

        this.borderLeft = new Border();
        this.borderLeft.setStyles({
            backgroundColor: 'rgba(199, 209, 227, 0.8)',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            position: 'absolute',
            cursor: 'move'
        });

        let drag1 = false;
        let startX1;
        this.borderLeft.on('mousedown', e => {
            e.stopPropagation();
            width = this.getSize()[0];
            const { screenX } = e;
            drag1 = true;
            startX1 = screenX;
        });
        document.addEventListener('mousemove', e => {
            if (!drag1) {
                return;
            }

            const { screenX } = e;
            const delta = (screenX - startX1) / width;
            startX1 = screenX;
            const [left, right] = this.getBounds();
            const newLeft = left + delta;

            if (newLeft > 0 && newLeft < right) {
                this.setBounds([newLeft, right]);
            }
        });
        document.addEventListener('mouseup', e => {
            drag1 = false;
        });


        this.borderRight = new Border();
        this.borderRight.setStyles({
            backgroundColor: 'rgba(199, 209, 227, 0.8)',
            right: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            position: 'absolute',
            cursor: 'move'
        });
        let drag2 = false;
        let startX2;
        this.borderRight.on('mousedown', e => {
            e.stopPropagation();
            width = this.getSize()[0];
            const { screenX } = e;
            drag2 = true;
            startX2 = screenX;
        });
        document.addEventListener('mousemove', e => {
            if (!drag2) {
                return;
            }

            const { screenX } = e;
            const delta = (screenX - startX2) / width;
            startX2 = screenX;
            const [left, right] = this.getBounds();
            const newRight = right + delta;

            if (right < 1 && newRight > left) {
                this.setBounds([left, newRight]);
            }
        });
        document.addEventListener('mouseup', e => {
            drag2 = false;
        });

        this.movingBox.appendElements(this.borderLeft, this.borderRight);

        this.paranjaLeft = Element.createElement('div');
        this.paranjaLeft.setStyles({
            backgroundColor: 'rgba(238, 244, 255, 0.8)'
        });

        this.paranjaRight = Element.createElement('div');
        this.paranjaRight.setStyles({
            backgroundColor: 'rgba(238, 244, 255, 0.8)'
        });

        this.setBounds(this.bounds);
        this.element.appendElements(this.paranjaLeft, this.movingBox, this.paranjaRight);
    }

    setBounds(bounds) {
        const [leftX, rightX] = bounds;
        this.paranjaLeft.setStyles({
            minWidth: `${leftX * 100}%`,
        });
        this.paranjaRight.setStyles({
            minWidth: `${(1 - rightX) * 100}%`,
        });
        this.bounds = bounds;
        this.onChangeBounds(bounds);
    }

    getBounds() {
        return this.bounds;
    }

    on(eventName, callback) {
        if (eventName !== 'changeBounds') {
            super.on(eventName, callback);
        } else {

        }
    }
}

export default Slider;
