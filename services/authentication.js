const JWT = require('jsonwebtoken');

const secret = "sdbhdgjhf";

function createTokenFromUser(user) {
    const payLoad = {
        name:user.fullName,
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };

    const token = JWT.sign(payLoad, secret);

    // console.log(token);

    return token;
}

function validateToken(token) {

    const payLoad = JWT.verify(token, secret);
    return payLoad;
}

module.exports = {
    createTokenFromUser,
    validateToken
}