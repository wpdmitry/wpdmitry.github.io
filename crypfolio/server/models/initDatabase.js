module.exports = async (supportedCoins) => {
    const {model: Pair} = require('./pair');
    const {model: Coin} = require('./coin');
    const burse = require('../burse/yobit');

    const result = await burse.getAllPairs();

    let pairs = Object.keys(result['pairs']);

    pairs = pairs.filter(pair => {
        const [coinL, coinR] = pair.toUpperCase().split('_');
        return coinL in supportedCoins && coinR in supportedCoins;
    });

    const pairsWithPrice = await burse.checkPrice(pairs);

    pairsWithPrice.forEach(pairWithPrice => {
        const pairName = pairWithPrice.pair.replace('_', '/');
        const coinName = pairName.split('/')[0].toUpperCase();
        const currentPrice = pairWithPrice.price;

        const newCoin = new Coin({
            name: coinName,
            icon: supportedCoins[coinName],
        });

        const newPair = new Pair({
            pairName,
            coinName,
            currentPrice,
        });

        newCoin.save();
        newPair.save();
    })
};