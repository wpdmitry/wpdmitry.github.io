const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pairName: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
    schema: transactionSchema,
    model: Transaction,
};