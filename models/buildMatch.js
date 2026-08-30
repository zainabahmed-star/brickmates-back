const mongoose = require('mongoose')

const buildMatchSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    setNum: {
        type: String,
        required: true,
    },
    setName: {
        type: String,
    },
    currentStep: {
        type: Number,
        default: 0,
    },
    totalSteps: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active',
    },
}, { timestamps: true })

const BuildMatch = mongoose.model('BuildMatch', buildMatchSchema)
module.exports = BuildMatch