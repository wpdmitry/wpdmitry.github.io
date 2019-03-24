const colors = [
    'red',
    'blue',
    'black',
    'green',
    'yellow',
    'orange'
];

export default (data, extra) => {
    const result = {
        ...data,
        actives: {}
    };

    if (!result.colors) {
        result.colors = {};
    }

    data.columns.slice(1).forEach((column, index) => {
        const [name] = column;

        result.actives[name] = true;

        if (!result.colors[name]) {
            result.colors[name] = colors[index % colors.length];
        }
    });

    return {
        ...result,
        ...extra
    };
};
