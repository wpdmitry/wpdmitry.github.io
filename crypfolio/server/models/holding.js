const {schema: batchSchema} = require('./batch');

const mongoose = require('mongoose');

const holdingSchema = mongoose.Schema({
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    pairName: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    batches: {
        type: [batchSchema],
        required: true,
        default: [],
    }
});

const Holding = mongoose.model('Holding', holdingSchema);

module.exports = {
    schema: holdingSchema,
    model: Holding,
};