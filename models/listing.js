const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    owner: {
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
    condition: {
        type: String,
        enum: ['built', 'sealed'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    photos: [{
        url: {
            type: String,
        },
        publicId: {
            type: String,
        },
    }],
    status: {
        type: String,
        enum: ['available', 'pending', 'sold'],
        default: 'available',
    },
}, { timestamps: true })

const Listing = mongoose.model('Listing', listingSchema)
module.exports = Listing