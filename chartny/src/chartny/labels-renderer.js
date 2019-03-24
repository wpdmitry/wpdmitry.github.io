import { getElementSize, checkElementSizeByTextContent, range } from './helpers';
import Mapper from './Mapper';

const getFromSize = (X, viewX) => {
    let xMin = X[0];
    let xMax = X[X.length - 1];

    const deltaX = xMax - xMin;
    xMin = xMin + deltaX * viewX[0];
    xMax = xMax - deltaX * (1 - viewX[1]);

    return [xMin, 0, xMax, 0];
};

const renderValue = value => new Date(value).toLocaleString('en', { month: 'short', day: 'numeric' });

const renderLabels = (root, chart) => {
    const [rootWidth, rootHeight] = getElementSize(root);
    const { columns, viewBoxByX } = chart;
    const X = columns[0].slice(1);

    const fromSize = getFromSize(X, viewBoxByX);
    const toSize = [0, 0, rootWidth, 0];
    const mapper = new Mapper(fromSize, toSize);

    const container = document.createElement('div');
    container.style.display = 'block';
    container.style.wordSpacing = 'nowrap';
    container.style.position = 'relative';
    container.style.width = `${rootWidth}px`;
    container.style.height = '100%';
    container.style.overflow = 'hidden';
    root.appendChild(container);

    const minWidth = checkElementSizeByTextContent(renderValue(X[0]))[0];

    const count = Math.floor(rootWidth / minWidth);

    const MAX_COUNT = 2 * count;
    const elements = range(0, MAX_COUNT, 1).map(() => {
        const div = document.createElement('div');
        div.style.display = 'inline-block';
        div.style.color = 'rgba(0, 0, 0, 0.5)';
        div.style.textAlign = 'center';
        div.style.wordSpacing = 'nowrap';
        div.style.position = 'absolute';
        container.appendChild(div);
        return div;
    });

    const render = () => {
        const { viewBoxByX } = chart;

        const N_left = 2 ** Math.floor(Math.log2(X.length * viewBoxByX[0] < 1 ? 0 : X.length * viewBoxByX[0]));
        const N_right = 2 ** Math.ceil(Math.log2(X.length * viewBoxByX[1]));

        const step = Math.ceil((N_right - N_left) / count);
        const maxZoom = Math.ceil(Math.log2(step));
        const n = 2 ** maxZoom;

        const indexes = range(N_left, N_right, n).filter(index => index >= 0 && index < X.length);

        elements.forEach(elem => {
            elem.textContent = '';
        });

        indexes.forEach((N_x, index) => {
            if (index > elements.length) {
                return
            }
            const elem = elements[index];
            const x = X[N_x];
            elem.textContent = renderValue(x);
            elem.style.left = `${mapper.mapToX(x)}px`;
        });
    };

    chart.subscribe('changeViewBoxByX', () => {
        const { viewBoxByX } = chart;
        const fromSize = getFromSize(X, viewBoxByX);
        mapper.setFromSize(fromSize);
        render();
    });

    render();
};

export default renderLabels;
