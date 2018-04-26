module.exports = async (checkInterval) => {
    const {model: Pair} = require('./pair');
    const burse = require('../burse/yobit');

    let pairs = await Pair.getPairs();
    pairs = pairs.map(({pairName}) => pairName);

    setTimeout(loop, checkInterval);

    async function loop() {
        const pairsWithPrice = await burse.checkPrice(pairs);

        pairsWithPrice.forEach(pairWithPrice => {
            const pairName = pairWithPrice.pair.replace('_', '/').toUpperCase();
            const currentPrice = pairWithPrice.price;

            Pair.changeCurrentPrice(pairName, currentPrice);
        });

        setTimeout(loop, checkInterval);
    }
};