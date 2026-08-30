const mongoose = require('mongoose')

const queueEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    setNum: {
        type: String,
        required: true,
    },
    setName: {
        type: String,
    },
    status: {
        type: String,
        enum: ['waiting', 'matched', 'cancelled'],
        default: 'waiting',
    },
}, { timestamps: true })

const QueueEntry = mongoose.model('QueueEntry', queueEntrySchema)
module.exports = QueueEntry