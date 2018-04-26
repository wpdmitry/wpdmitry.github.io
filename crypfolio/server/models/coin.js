const mongoose = require('mongoose');

const coinSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    icon: {
        type: String
    }
});

coinSchema.statics.getCoinNames = function (callback) {
    return this.find({}, {name: 1, _id: 0}, callback);
};

coinSchema.statics.getCoinIcon = async function (coinName) {
    return new Promise(((resolve, reject) => {
        this.findOne({name: coinName}, {icon: 1, _id: 0}, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result.icon);
        })
    }));
};

const Coin = mongoose.model('Coin', coinSchema);

module.exports = {
    schema: coinSchema,
    model: Coin,
};