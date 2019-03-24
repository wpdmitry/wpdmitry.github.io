import Mapper from './Mapper';
import Drawer from './Drawer';
import { getElementSize, neighborSearch, range } from './helpers';

const getFromSize = (X, Y, viewX) => {
    const DIVISION_COUNT = 6;
    let xMin = X[0];
    let xMax = X[X.length - 1];

    const deltaX = xMax - xMin;
    xMin = xMin + deltaX * viewX[0];
    xMax = xMax - deltaX * (1 - viewX[1]);

    const xMinIndex = Math.floor((X.length - 1) * viewX[0]);
    const xMaxIndex = Math.ceil((X.length - 1) * viewX[1]);

    const windowIndexes = xMaxIndex - xMinIndex;
    const leftIndex = Math.floor(xMinIndex - 0.5 * windowIndexes) < 0 ? 0 : Math.floor(xMinIndex - 0.5 * windowIndexes);
    const rightIndex = Math.floor(xMaxIndex + 0.5 * windowIndexes) > X.length - 1 ? X.length - 1 : Math.floor(xMaxIndex + 0.5 * windowIndexes);

    const yMin = Math.min(...Y.reduce((res, array) => [...res, ...array.slice(leftIndex, rightIndex)], []));
    const yMax = Math.max(...Y.reduce((res, array) => [...res, ...array.slice(leftIndex, rightIndex)], []));

    const yStart = DIVISION_COUNT * Math.floor(yMin / DIVISION_COUNT);
    const yEnd = DIVISION_COUNT * Math.ceil(yMax / DIVISION_COUNT);

    return [xMin, yStart, xMax, yEnd];
};

const createValueAccumulator = initialValue => {
    let lastValue = null;
    let currentValue = initialValue;
    let lastDelta = null;
    let isChangedFirstDerivativeSign = false;

    const fill = value => {
        const newDelta = value - currentValue;

        isChangedFirstDerivativeSign = newDelta >= 0 && lastDelta < 0 || newDelta <= 0 && lastDelta > 0;
        lastValue = currentValue;
        currentValue = value;
        lastDelta = newDelta;
    };

    const getLastValue = () => lastValue;

    const getCurrentValue = () => currentValue;

    const getIsChangedFirstDerivativeSign = () => isChangedFirstDerivativeSign;

    return {
        fill,
        getLastValue,
        getCurrentValue,
        getIsChangedFirstDerivativeSign
    };
};


export default (root, chart, options = {}) => {
    const [rootWidth, rootHeight] = getElementSize(root);
    const { columns, colors, viewBoxByX, actives, yKeys } = chart;
    const [X, ...Y] = columns
        .filter(([name]) => !actives.hasOwnProperty(name) || actives[name])
        .map(([, ...values]) => values);

    const fromSize = getFromSize(X, Y, viewBoxByX);
    const toSize = [0, 0, rootWidth, rootHeight];

    const mapper = new Mapper(fromSize, toSize);
    const drawer = new Drawer(root, mapper);

    const pls = {};
    columns.forEach(([name, ...Y]) => {
        const pl = drawer.createPolyline([X, Y], {
            fill: 'none',
            stroke: colors[name],
            'stroke-width': 2
        });

        if (!actives[name]) {
            pl.hide();
        }

        pls[name] = pl;
    });

    let grid;
    if (!options.hasOwnProperty('grid') || options.grid) {
        const [, yMin,, yMax] = fromSize;
        const step = (yMax - yMin) / 6;
        grid = drawer.createHorizontalLines(range(yMin, yMax, step), {
            'stroke-width': 1,
            'stroke': '#959595',
            'stroke-opacity': 0.2,
            'fill': '#959595'
        });
    }

    const runner = drawer.createRunner({
        yKeys,
        colors,
        actives,
        options: {
            'stroke-width': 1,
            'stroke': '#959595',
            'stroke-opacity': 0.4,
            'fill': '#959595'
        }
    });

    runner.on('mousemove', e => {
        const { x } = e;
        const { viewBoxByX, actives, yKeys } = chart;
        const [X, ...Y] = columns;

        const xStart = Math.floor(X.length * viewBoxByX[0]);
        const xEnd = Math.ceil(X.length * viewBoxByX[1]);

        const foundXIndex = neighborSearch(X, x, xStart, xEnd);
        const foundedX = X[foundXIndex];
        const foundedYs = Y.map(([key, ...y]) => [key, y[foundXIndex]]);
        runner.setPosition(foundedX, foundedYs);
    });

    runner.on('mouseenter', () => {
        runner.show();
    });

    runner.on('mouseleave', () => {
        runner.hide();
    });

    chart.subscribe('changeActives', () => {
        const { columns, viewBoxByX, actives } = chart;
        const [X, ...Y] = columns
            .filter(([name]) => !actives.hasOwnProperty(name) || actives[name])
            .map(([, ...values]) => values);

        const newFromSize = getFromSize(X, Y, viewBoxByX);
        mapper.setFromSize(newFromSize);

        runner.setActives(actives);

        Object.keys(pls).forEach(name => {
            const pl = pls[name];

            if (actives[name]) {
                pl.show();
                pl.redraw();
            } else {
                pl.hide();
            }
        });

        if (grid) {
            const [, yMin,, yMax] = newFromSize;
            const step = (yMax - yMin) / 6;
            grid.remove();
            grid = drawer.createHorizontalLines(range(yMin, yMax, step), {
                'stroke-width': 1,
                'stroke': '#959595',
                'stroke-opacity': 0.1,
                'fill': '#959595'
            });
        }
    });

    const valueAccumulator = createValueAccumulator(fromSize[3]);

    chart.subscribe('changeViewBoxByX', () => {
        if (options.hasOwnProperty('viewBoxByX') && !options.viewBoxByX) {
            return
        }
        const { columns, viewBoxByX } = chart;
        const [X, ...Y] = columns
            .filter(([name]) => !actives.hasOwnProperty(name) || actives[name])
            .map(([, ...values]) => values);

        const [newXMin, newYMin, newXMax, newYMax] = getFromSize(X, Y, viewBoxByX);

        valueAccumulator.fill(newYMax);

        if (valueAccumulator.getIsChangedFirstDerivativeSign()) {
            mapper.setFromSize([newXMin, newYMin, newXMax, newYMax]);

            const step = (newYMax - newYMin) / 6;
            grid.remove();
            grid = drawer.createHorizontalLines(range(newYMin, newYMax, step), {
                'stroke-width': 1,
                'stroke': '#959595',
                'stroke-opacity': 0.2,
                'fill': '#959595'
            });
        } else {
            const lastMaxY = valueAccumulator.getLastValue();
            mapper.setFromSize([newXMin, newYMin, newXMax, lastMaxY]);
        }

        Object.keys(pls).forEach(name => {
            const pl = pls[name];
            if (actives[name]) {
                pl.redraw();
            }
        });
    });
};
