class SvgElement {
    setOptions(options) {
        Object.keys(options).forEach(key => {
            this.getNativeElement().setAttribute(key, options[key]);
        });
    }

    hide() {
        this.setOptions({
            opacity: 0
        });
    }

    show() {
        this.setOptions({
            opacity: 1
        });
    }

    getNativeElement() {
        const { element } = this;

        if (element instanceof SvgElement) {
            return element.getNativeElement();
        }

        return element;
    }

    appendElements(...elements) {
        elements.forEach(element => {
            this.getNativeElement().appendChild(element.getNativeElement());
        })
    }

    removeElements(...elements) {
        elements.forEach(element => {
            this.getNativeElement().removeChild(element.getNativeElement());
        })
    }

    removeElement() {
        console.log(this, this.getNativeElement());
        const parent = this.getNativeElement().parentNode();
        parent.removeChild(this.getNativeElement());
    }

    on(eventName, callback) {
        this.getNativeElement().addEventListener(eventName, callback);
    }

    off(eventName, callback) {
        this.getNativeElement().removeEventListener(eventName, callback);
    }
}

class Svg extends SvgElement {
    constructor(width, height) {
        super();
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.element.setAttribute('viewBox', `0 0 ${width} ${height}`);
        this.element.setAttribute('width', width);
        this.element.setAttribute('height', height);
    }
}

class Polyline extends SvgElement {
    constructor(points = [], options = {}) {
        super();
        this.element = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
        this.setOptions(options);
        this.setPoints(points);
    }

    setPoints(points) {
        const [xs, ys] = points;
        const pointsToString = xs
            .reduce((res, x, index) => `${res}${x},${ys[index]} `, '');
        this.element.setAttribute('points', pointsToString);
    }
}

class Text extends SvgElement {
    constructor(x, y, text, options = {}) {
        super();
        this.element = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        this.setText(text);
        this.setPosition(x, y);
        this.setOptions(options);
    }

    setText(text) {
        this.element.textContent = text;
    }

    setPosition(x, y) {
        this.element.setAttribute('x', x);
        this.element.setAttribute('y', y);
    }
}

class Line extends SvgElement {
    constructor(from, to, options = {}) {
        super();
        this.element = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        this.setPosition(from, to);
        this.setOptions(options);
    }

    setPosition(from, to) {
        const [x1, y1] = from;
        const [x2, y2] = to;
        this.element.setAttribute('x1', x1);
        this.element.setAttribute('y1', y1);
        this.element.setAttribute('x2', x2);
        this.element.setAttribute('y2', y2);
    }
}

class G extends SvgElement {
    constructor(options = {}) {
        super();
        this.element = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.setOptions(options);
    }
}

class Circle extends SvgElement {
    constructor(x, y, options = {}) {
        super();
        this.element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        this.setOptions(options);
        this.setPosition(x, y);
    }

    setPosition(x, y) {
        this.element.setAttribute('cx', x);
        this.element.setAttribute('cy', y);
    }
}

class Rectangle extends SvgElement {
    constructor(x, y, options = {}) {
        super();
        this.element = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.setOptions(options);
        this.setPosition(x, y);
    }

    setPosition(x, y) {
        this.element.setAttribute('x', x);
        this.element.setAttribute('y', y);
    }
}

class Runner extends SvgElement {
    constructor({ x = -20, ys = [], yKeys, colors, actives, options }) {
        super();
        this.yKeys = yKeys;
        this.colors = colors;
        this.actives = actives;

        this.element = new G();

        this.paranja = new Rectangle(0, 0, {
            width: '100%',
            height: '100%',
            fill: 'none'
        });
        this.line = new Line([x, 0], [x, '100%'], options);
        this.element.appendElements(this.paranja, this.line);


        this.circles = {};
        yKeys.forEach(key => {
            const circleWrapper = new G({
                transform: `translate(-100, -100)`
            });
            const circle = new Circle(0, 0, { r: '6', fill: colors[key] });
            const innerCircle = new Circle(0, 0, { r: '4', fill: 'white' });
            circleWrapper.appendElements(circle, innerCircle);
            this.element.appendElements(circleWrapper);
            this.circles[key] = circleWrapper;
        });
    }

    setPosition(x, ys) {
        this.line.setPosition([x, 0], [x, '100%']);
        ys.forEach(([key, y]) => this.circles[key].setOptions({ transform: `translate(${x}, ${y})` }));
    }

    setActives(actives) {
        this.yKeys.forEach(key => {
            const circle = this.circles[key];
            if (actives[key]) {
                circle.show();
            } else {
                circle.hide();
            }
        })
    }

    on(eventName, callback) {
        this.paranja.getNativeElement().addEventListener(eventName, callback);
    }

    showCircle(yKey) {
        this.circles[key].show();
    }

    hideCircle(yKey) {
        this.circles[key].hide();
    }
}

class Drawer {
    constructor(container, mapper) {
        this.container = container;
        this.mapper = mapper;

        const {toWidth, toHeight} = mapper;
        this.svg = new Svg(toWidth, toHeight);
        this.container.appendChild(this.svg.getNativeElement());
    }

    createPolyline(points, options) {
        const [xs, ys] = this.mapper.mapToPoints(points);
        const polyline = new Polyline([xs, ys.map(y => this.mapper.toHeight - y)], options);
        this.svg.appendElements(polyline);

        const redraw = (newPoints, newOptions) => {
            const ps = newPoints || points;
            const [xs, ys] = this.mapper.mapToPoints(ps);
            polyline.setPoints([xs, ys.map(y => this.mapper.toHeight - y)]);

            if (newOptions) {
                polyline.setOptions(newOptions);
            }
        };

        const hide = () => {
            polyline.hide();
        };

        const show = () => {
            polyline.show();
        };

        return {
            redraw,
            hide,
            show
        };
    }

    createHorizontalLines(positions, options) {
        const elements = [];
        positions.forEach(pos => {
            const y = this.mapper.toHeight - this.mapper.mapToY(pos);

            const line = new Line([0, y], ['100%', y], options);
            const text = new Text(0, y - 5, pos, options);
            elements.push(line, text);
        });

        const g = new G();
        g.appendElements(...elements);
        this.svg.appendElements(g);

        const redraw = (newOptions) => {
            if (newOptions) {
                console.log(newOptions);
                g.setOptions(newOptions);
            }
        };

        const remove = () => {
            this.svg.removeElements(g);
        };

        return {
            redraw,
            remove
        };
    }

    createRunner({ x = 0, ys = [], yKeys, colors, actives, options }) {
        const newX = this.mapper.mapToX(x);
        const newYs = ys.map(y => this.mapper.mapToY(y));
        const runner = new Runner({ x: newX, ys: newYs, yKeys, colors, actives, options });
        this.svg.appendElements(runner);

        const onWrapper = on => (eventName, callback) => {
            on(eventName, e => {
                const x = this.mapper.mapFromX(e.x);
                callback({ x });
            })
        };

        const setPositionWrapper = setPosition => (x, ys) => {
            const newX = this.mapper.mapToX(x);
            const newYs = ys.map(([key, y]) => [key, this.mapper.toHeight - this.mapper.mapToY(y)]);
            setPosition(newX, newYs);
        };

        return {
            setActives: runner.setActives.bind(runner),
            show: runner.show.bind(runner),
            hide: runner.hide.bind(runner),
            on: onWrapper(this.svg.on.bind(this.svg)),
            setPosition: setPositionWrapper(runner.setPosition.bind(runner))
        }
    }
}

export default Drawer;
