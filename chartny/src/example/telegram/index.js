import Charnty from '../../chartny';
import chartsData from './chart_data';
import inputTelegramAdapter from './inputTelegramAdapter';
import FilterButton from './FilterButton';
import Element from './Element';
import Slider from './Slider';

const initialViewBoxByX = [0.2, 0.8];
const root = new Element(document.getElementById('root'));

chartsData.forEach((data, index) => {
    const input = inputTelegramAdapter(data, { viewBoxByX: initialViewBoxByX });
    const chart = Charnty.createChart(input);

    const titleContainer = Element.createElement('h2');
    titleContainer.setText(`chart #${index + 1}`);

    const chartContainer = Element.createElement('div');
    chartContainer.setStyles({
        width: '500px',
        height: '500px',
        marginBottom: '5px'
    });

    const labelsContainer = Element.createElement('div');
    labelsContainer.setStyles({
        width: '500px',
        height: '20px',
        marginBottom: '20px'
    });

    const sliderContainer = Element.createElement('div');
    sliderContainer.setStyles({
        width: '500px',
        height: '80px',
        position: 'relative',
        marginBottom: '20px'
    });

    const buttonsContainer = Element.createElement('div');
    buttonsContainer.setStyles({
        display: 'flex',
        alignItems:' center',
        marginBottom: '70px'
    });

    const { colors, yKeys } = chart;
    yKeys.forEach(key => {
        const FilterBtn = new FilterButton({
            text: key,
            color: colors[key],
            active: true
        });
        FilterBtn.setStyles({
            marginRight: '10px'
        });

        chart.subscribe('changeActives', () => {
            const { actives } = chart;
            FilterBtn.setActive(actives[key]);
        });

        FilterBtn.on('click', () => {
            const { actives } = chart;
            chart.changeActives(key, !actives[key]);
        });

        buttonsContainer.appendElements(FilterBtn);
    });

    const SliderUI = new Slider({
        bounds: initialViewBoxByX,
        onChangeBounds: ([x1, x2]) => {
            chart.changeViewBoxByX(x1, x2);
        }});
    SliderUI.setStyles({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    });


    root.appendElements(titleContainer, chartContainer, labelsContainer, sliderContainer, buttonsContainer);

    Charnty.render(chartContainer.getNativeElement(), chart);
    Charnty.render(sliderContainer.getNativeElement(), chart, { viewBoxByX: false, grid: false });
    Charnty.renderLabels(labelsContainer.getNativeElement(), chart);
    SliderUI.appendTo(sliderContainer.getNativeElement());
});

