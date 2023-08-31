const enc = require('../services/encryptionService');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        minLength: 3,
        required: true,
    }
},
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password;
                return ret;
            }
        }
    });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await enc.hash(this.password, SALT_ROUNDS);
    return next();
});

module.exports = mongoose.model('User', userSchema);