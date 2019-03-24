class Mapper {
    constructor(from, to) {
        this.fromMinX = from[0];
        this.fromMinY = from[1];
        this.fromMaxX = from[2];
        this.fromMaxY = from[3];

        this.toMinX = to[0];
        this.toMinY = to[1];
        this.toMaxX = to[2];
        this.toMaxY = to[3];
    }

    get toWidth() {
        return this.toMaxX - this.toMinX;
    }

    get toHeight() {
        return this.toMaxY - this.toMinY;
    }

    get fromWidth() {
        return this.fromMaxX - this.fromMinX;
    }

    get fromHeight() {
        return this.fromMaxY - this.fromMinY;
    }

    mapFromX(x) {
        return x * this.fromWidth / this.toWidth + this.fromMinX;
    }

    mapFromY(y) {
        // return y * this.fromWidth / this.toWidth;
    }

    mapToX(x) {
        return (x - this.fromMinX) * this.toWidth / this.fromWidth;
    }

    mapToY(y) {
        return (y - this.fromMinY) * this.toHeight / this.fromHeight;
    }

    mapToXY(x, y) {
        return [this.mapToX(x), this.mapToY(y)];
    }

    mapToPoints(points) {
        const [xs, ys] = points;
        return [
            xs.map(x => this.mapToX(x)),
            ys.map(y => this.mapToY(y))
        ];
    }

    setFromSize(from) {
        this.fromMinX = from[0];
        this.fromMinY = from[1];
        this.fromMaxX = from[2];
        this.fromMaxY = from[3];
    }
}

export default Mapper;
