module.exports = (obj) => {
    obj.balance = rouding(obj.balance);
    obj.diffBalance = rouding(obj.diffBalance);

    obj.diffBalance = +obj.diffBalance > 0 ? '+' + obj.diffBalance : obj.diffBalance;

    obj.holdings.forEach(holding => {
        holding.currentPrice = rouding(holding.currentPrice);
        holding.totalAmount = rouding(holding.totalAmount);
        holding.totalCost = rouding(holding.totalCost);
        holding.totalDiffCost = rouding(holding.totalDiffCost);
        holding.totalDiffCost = +holding.totalDiffCost > 0 ? '+' + holding.totalDiffCost : holding.totalDiffCost;

        holding.batches.forEach(batch => {
            batch.cost = rouding(batch.cost);
            batch.diffCost = rouding(batch.diffCost);
            batch.diffCost = +batch.diffCost > 0 ? '+' + batch.diffCost : batch.diffCost;
            batch.price = rouding(batch.price);
            batch.amount = rouding(batch.amount);
        })
    });

    return obj;
};

function rouding(number) {
    if (Math.abs(number) >= 1) {
        return number.toFixed(2);
    }

    if (Math.abs(number) < 1) {
        const str = String(number);
        let pointIndex = str.match(/[1-9]/).index;

        pointIndex = pointIndex < 0 ? pointIndex - 1: pointIndex;

        return parseFloat(str).toFixed(pointIndex);
    }
}