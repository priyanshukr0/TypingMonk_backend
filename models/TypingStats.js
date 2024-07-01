const mongoose = require("mongoose")

const statsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timeStats: {
        type: {
            "10sec": {
                type: {
                    wpm: String,
                    accuracy: String
                },
                
            },
            "30sec": {
                type: {
                    wpm: String,
                    accuracy: String
                },
                
            },
            "60sec": {
                type: {
                    wpm: String,
                    accuracy: String
                },
                
            },
            "120sec": {
                type: {
                    wpm: String,
                    accuracy: String
                },
                default: {}
            },
        },
        default: {}
    },
    wordStats: {
        type: {
            "10words": {
                type: {
                    wpm: String,
                    accuracy: String
                },
                default: {}
            },
            "25words": {
                type: {
                    wpm: String,
                    accuracy: String
                },
                default: {}
            },
            "50words": {
                type: {
                    wpm: String,
                    accuracy: String
                },
                default: {}
            },
            "100words": {
                type: {
                    wpm: String,
                    accuracy: String
                },
                default: {}
            },
        },
        default: {}
    }
})

module.exports = mongoose.model('TypingStats', statsSchema); 