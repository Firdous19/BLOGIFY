const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenFromUser } = require('../services/authentication');


const userSchema = new Schema({
    fullName: {
        type: "String",
        required: true,
    },

    email: {
        type: "String",
        required: true,
        unique: true
    },

    salt: {
        type: "String",
    },

    password: {
        type: "String",
        required: true,
    },

    profileImageURL: {
        type: "String",
        default: '/images/images.png'
    },

    role: {
        type: "String",
        enum: ["USER", "ADMIN"],
        default: 'USER'
    }
}, { timestamp: true });

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User Not Found');

    const salt = user.salt;
    const hashedPassword = user.password;


    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex");


    if (hashedPassword !== userProvidedHash)
        throw new Error('Incorrect Password');

        const token =createTokenFromUser(user);
        return token;
})

const User = new model("users", userSchema);

module.exports = User;