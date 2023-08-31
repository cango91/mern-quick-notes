const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken');
const User = require('../models/user');

function createJWT(user, expiresIn) {
    return jwt.sign(
        { user },
        process.env.SECRET,
        { expiresIn }
    );
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function createRefreshToken(user) {
    const token = jwt.sign(
        { user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    const refreshToken = new RefreshToken({
        token,
        user: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        //expiresAt: new Date(Date.now() + 60 * 1000),
    });

    await refreshToken.save();
    return token;
}

async function refreshToken(token) {
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken || storedToken.revoked || storedToken.expiresAt < Date.now()) {
        throw new Error('Invalid refresh token.')
    }
    const user = await User.findById(storedToken.user);
    if (!user) {
        throw new Error('User not found!');
    }
    const newAccessToken = createJWT(user, process.env.TOKEN_EXP);
    // rotate refreshToken so the user doesn't have to re-authenticate too often
    const newRefreshToken =  await createRefreshToken(user);
    await storedToken.deleteOne();
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

function getUserFromToken(token) {
    return token ? parseJwt(token).user : null;
}

async function deleteToken(token) {
    return await RefreshToken.findOneAndDelete({ token });
}

async function getTokenStatus(token) {
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken || storedToken.revoked) return 'Invalid token';
    if (storedToken.expiresAt < Date.now()) return 'Expired token';
    return 'OK';
}

module.exports = {
    createJWT,
    createRefreshToken,
    refreshToken,
    getUserFromToken,
    delete: deleteToken,
    getTokenStatus,
}

