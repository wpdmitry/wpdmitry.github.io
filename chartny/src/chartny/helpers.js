export const getElementSize = element => {
    const { width: rawW, height: rawH } = window.getComputedStyle(element);

    if (rawW && rawH) {
        const w = parseInt(rawW, 10);
        const h = parseInt(rawH, 10);
        return [w, h];
    }

    throw new Error('Failed to calculate the size of the element');
};

export const checkElementSizeByTextContent = content => {
    const checker = document.createElement('div');
    checker.style.display = 'inline-block';
    checker.textContent = content;
    document.body.appendChild(checker);

    const size = getElementSize(checker);
    document.body.removeChild(checker);

    return size;
};

export const neighborSearch = (array, target, start, end) => {
    const s = start || 0;
    const e = end || array.length - 1;

    if (e - s === 1) {
        return target > array[s] ? e : s;
    }

    const middle = Math.floor((s + e) / 2);

    const [newStart, newEnd] = target > array[middle] ? [middle, e] : [s, middle];
    return neighborSearch(array, target, newStart, newEnd);
};


export const animate = (from, to, duration, callback, callbackOnCompleted) => {
    const time = Date.now();
    const delta = to - from;

    const raf = () => {
        const currentTime = Date.now();
        const deltaTime = currentTime - time;

        if (deltaTime > duration) {
            if (callbackOnCompleted) {
                callbackOnCompleted();
            }
            return;
        }

        requestAnimationFrame(() => {
            const step = delta * deltaTime / duration;
            callback(from + step);
            raf();
        });
    };

    raf();
};

export const range = (start, end, step) => {
    const result = [];

    for (let i = start; i < end; i += step) {
        result.push(i);
    }

    return result;
};
