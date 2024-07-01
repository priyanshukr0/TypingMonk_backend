const { default: mongoose } = require('mongoose');
const mongnoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bestScore: {
        type: mongnoose.Schema.Types.ObjectId,
        ref: 'TypingStats',
        
    }, 
    emailVerified: { type: Boolean, default: false },
    otp: { type: String },
})

module.exports = mongnoose.model('User', UserSchema);
