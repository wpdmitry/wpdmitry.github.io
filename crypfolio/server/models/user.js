const mongoose = require('mongoose');
const {model: Coin, schema: coinSchema} = require('./coin');
const {model: Pair, schema: pairSchema} = require('./pair');
const {model: Transaction, schema: transactionSchema} = require('./transaction');
const {model: Holding, schema: holdingSchema} = require('./holding');
const {host, port} = require('../config');

const userSchema = mongoose.Schema({
    login: {
       type: String,
       required: true,
       unique: true
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    transactions: {
        type: [transactionSchema],
        default: [],
    },
    holdings: {
        type: [holdingSchema],
        default: [],
    }

});

userSchema.methods.getHolding = function(pairName) {
    return this.holdings
        .find(holding => holding.pairName === pairName.toUpperCase());
};

userSchema.methods.createHolding = async function(pairName) {
    const holding = new Holding({pairName});
    this.holdings.push(holding);

    return new Promise((resolve, reject) => {
        this.save((_, user) => resolve(this.getHolding(pairName)));
    })

};

userSchema.methods.checkCorrect = async function(transaction) {
    const {status, amount, pairName} = transaction;
    let holding = this.getHolding(pairName);

    if (status === 'buy' && !holding) {
        holding = await this.createHolding(pairName);
    }

    if (status === 'sell' || !holding) {
        const totalAmount = holding.totalAmount;

        if (totalAmount < amount) {
            throw new Error('Недостаточно средств, либо данный актив не существует');
        }
    }

    return holding;
};

userSchema.methods.addTransaction = async function (transaction) {
    const holding = await this.checkCorrect(transaction);

    this.changePortfolio(holding, transaction);

    const newTransaction = new Transaction(transaction);
    this.transactions.push(newTransaction);

    return new Promise(((resolve, reject) => {
        this.save((err, user) => {
            if (err) {
                reject(err);
            }

            resolve(transaction);
        })
    }));
};

userSchema.methods.getPortfolio = async function () {
    const holdings = this.holdings;

    let portfolio = {
        balance: 0,
        diffBalance: 0,
        holdings: [],
    };

    for(let i = 0; i < holdings.length; i++) {
        const {totalAmount, pairName, batches} = holdings[i];
        const currentPrice = await Pair.getCurrentPrice(pairName);
        const coinName = await Pair.getCoinName(pairName);
        const coinIcon = await Coin.getCoinIcon(coinName);
        const totalCost = totalAmount * currentPrice;

        const newHolding = {
            pairName,
            coinIcon: `${host}:${port}/images/${coinIcon}`,
            currentPrice,
            totalCost,
            totalAmount,
            totalDiffCost: 0,
            batches: []
        };

        batches.forEach(batch => {
            const {price, amount, date} = batch;
            const newBatch = {price, amount, date};

            newBatch.cost = amount * currentPrice;
            newBatch.diffCost = newBatch.cost - newBatch.amount * price;

            newHolding.totalDiffCost += newBatch.diffCost;
            newHolding.batches.push(newBatch);
        });

        portfolio.balance += newHolding.totalCost;
        portfolio.diffBalance += newHolding.totalDiffCost;


        portfolio.holdings.push(newHolding);
    }

    // portfolio = rouding(portfolio);
    // console.log(portfolio);

    return portfolio;
};

userSchema.methods.changePortfolio = function (holding, transaction) {
    let {amount, status, price} = transaction;


    switch (status) {
        case 'buy': {
            holding.batches.push({
                amount,
                price,
            });

            holding.totalAmount += amount;
            break;
        }
        case 'sell': {
            holding.totalAmount -= amount;

            while (amount > 0) {
                let bestBatch = {price: Infinity};

                holding.batches.forEach(batch => {
                    if ((price - batch.price > price - bestBatch.price) && batch.amount !== 0) {
                        bestBatch = batch;
                    }
                });

                if (bestBatch.amount - amount > 0) {
                    bestBatch.amount -= amount;
                    amount = 0;
                } else {
                    amount -= bestBatch.amount;
                    bestBatch.amount = 0;
                }
            }

            holding.batches = holding.batches
                .filter(batch => batch.amount > 1e-5);

            this.holdings.filter(holding => holding.totalAmount > 1e-5);
            // this.save();
            break;
        }
    }
};

userSchema.statics.getUser = async function (login, password) {
    return new Promise((resolve, reject) => {
        this.findOne({login, password}, (err, user) => {
            if (err) {
                reject(err);
            }

            resolve(user);
        })
    });
};

const User = mongoose.model('User', userSchema);

module.exports = {
   schema: userSchema,
   model: User,
};