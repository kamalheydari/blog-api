const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { schema } = require('./secure/userValidation');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255
    }
}, { timestamps: true });

userSchema.statics.userValidation = function(body) {
    return schema.validate(body, { abortEarly: false });
};

userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        } else {
            user.password = hash;
            next();
        }
    });
});

module.exports = mongoose.model('User', userSchema);