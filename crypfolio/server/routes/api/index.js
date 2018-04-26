const {accessCheck} = require('./helper');

const routerApi = require('express').Router();
const routerAuth = require('./auth');
const routerSuggest = require('./suggest');

routerApi.use('/auth', routerAuth);
routerApi.use('/suggest', routerSuggest);
routerApi.get('/portfolio', accessCheck, async(req, res) => {
    const user = req.user;

    try {
        const portfolio = await user.getPortfolio();
        res.json({
            error: null,
            data: portfolio,
        })
    } catch (err) {
        console.log(err);

        res.json({
            error: 'Не удалось получить состояние портфеля',
            data: null,
        })
    }
});
routerApi.post('/transaction', accessCheck, async (req, res) => {
    const user = req.user;
    const transaction = req.body;

    try {
        await user.addTransaction(transaction);

        res.json({
            error: null,
            data: null,
        })
    } catch(err) {
        console.log(err);

        res.status(500);
        res.json({
            error: 'Не удалось добавить транзакцию',
            data: null,
        })
    }
});

module.exports = routerApi;