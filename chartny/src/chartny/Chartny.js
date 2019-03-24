import chartRenderer from './chart-renderer';
import labelsRenderer from './labels-renderer';

class Chartny {
    constructor({ columns, types, names, colors, viewBoxByX, actives }) {
        this.columns = columns;
        this.types = types;
        this.names = names;
        this.colors = colors;
        this.actives = actives;
        this.yKeys = columns.slice(1).map(([key]) => key);
        this.viewBoxByX = viewBoxByX;

        this.subscribers = {};
    }

    changeViewBoxByX(x1, x2) {
        this.viewBoxByX = [x1, x2];
        this.emit('changeViewBoxByX');
    }

    changeActives(id, value) {
        this.actives[id] = value;
        this.emit('changeActives');
    }

    emit(eventName) {
        if (this.subscribers[eventName]) {
            this.subscribers[eventName].forEach(cb => cb(this));
        }
    }

    subscribe(eventName, callback) {
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }

        this.subscribers[eventName].push(callback);
        return () => this.subscribers[eventName].filter(cb => cb !== callback);
    }

    static createChart(input) {
        return new Chartny(input);
    }

    static render = chartRenderer;

    static renderLabels = labelsRenderer;
}

export default Chartny;
