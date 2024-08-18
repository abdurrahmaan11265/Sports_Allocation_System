const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Denied', 'Item Returned'], default: 'Pending' },
    // borrowedAt: { type: Date },
    // returnBy: { type: Date },
    // returned: { type: Boolean, default: false },
});

module.exports = mongoose.model('Request', RequestSchema);
