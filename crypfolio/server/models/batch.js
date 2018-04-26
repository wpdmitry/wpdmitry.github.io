const mongoose = require('mongoose');

const batchSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = {
    schema: batchSchema,
    model: Batch,
};