const mongoose = require('mongoose');

const pairSchema = mongoose.Schema({
    pairName: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    coinName: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    currentPrice: {
        type: Number,
        required: true,
    }
});

pairSchema.statics.changeCurrentPrice = function(pairName, currentPrice) {
    this.update({pairName}, {currentPrice}, () => {});
};

pairSchema.statics.getPairs = async function () {
    return new Promise((resolve, reject) => {
        this.find({}, {pairName: 1, _id: 0}, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        })
    })
};

pairSchema.statics.getPair = async function(pairName) {
    return new Promise(((resolve, reject) => {
        this.findOne({pairName}, {coinName: 1, currentPrice: 1, _id: 0}, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        })
    }));
};

pairSchema.statics.getCurrentPrice = async function(pairName) {
    return new Promise(((resolve, reject) => {
        this.findOne({pairName}, {currentPrice: 1, _id: 0}, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result.currentPrice);
        });
    }))
};

pairSchema.statics.getCoinName = async function (pairName) {
    return new Promise(((resolve, reject) => {
        this.findOne({pairName}, {coinName: 1, _id: 0}, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result.coinName);
        })
    }))
};

const Pair = mongoose.model('Pair', pairSchema);

module.exports = {
    schema: pairSchema,
    model: Pair,
};