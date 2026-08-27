const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
    },
        avatar: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    favoriteTheme: {
        type: String,
        default: '',
    },
    collectionSetIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Set',
    },
    wishlistSetIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Set',
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

}, {timestamps: true})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.password
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User