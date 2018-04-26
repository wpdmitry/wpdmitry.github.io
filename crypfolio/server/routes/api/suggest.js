const {model: Coin, schema: coinSchema} = require('../../models/coin');
const {model: Pair, schema: pairSchema} = require('../../models/pair');
const {accessCheck} = require('./helper');

const routerSuggest = require('express').Router();

routerSuggest.get('/coin', accessCheck, async (req, res) => {
    const term = req.query.term.toUpperCase();
    console.log(term);
    try {
        const coinNames = await Coin.getCoinNames();

        const suggestCoins = coinNames
            .map(({name}) => name)
            .filter(name => name.indexOf(term) !== -1);

        res.json({
            error: null,
            data: suggestCoins,
        });
    } catch (err) {
        res.status(500);
        res.json({
            error: 'Не удалось получить список названий монет',
            data: null,
        })
    }
});
routerSuggest.get('/pairs', accessCheck, async (req, res) => {
    const coinName = req.query.name.toUpperCase();

    try {
        const pairs = await Pair.getPairs(coinName);

        const suggestPairs = pairs
            .filter(({pairName}) => pairName.startsWith(coinName))
            .map(({pairName}) => pairName);

        res.json({
            error: null,
            data: suggestPairs,
        });

    } catch (err) {
        res.status(500);
        res.json({
            error: 'Не удалось ничего найти',
            data: null,
        });
    }
});
routerSuggest.get('/price', accessCheck, async (req, res) => {
    const pairName = req.query.name.toUpperCase();

    try {
        const currentPrice = await Pair.getCurrentPrice(pairName);

        res.json({
            error: null,
            data: currentPrice,
        });
    } catch (err) {
        res.status(500);
        res.json({
            error: 'Не удалось текущий курс',
            data: null,
        });
    }
});

module.exports = routerSuggest;