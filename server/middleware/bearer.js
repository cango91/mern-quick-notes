const jwt = require('jsonwebtoken');
const tokenService = require('../services/tokenService');
module.exports = async (req, res, next) => {
    let token = req.get('Authorization') || req.query.token;
    if (token) {
        token = token.replace('Bearer ', '');
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                const refreshToken = req.cookies.refreshToken;
                try{
                    const tokens = await tokenService.refreshToken(refreshToken);
                    if (tokens && tokens.accessToken) {
                        req.user = tokenService.getUserFromToken(tokens.accessToken);
                        res.set('New-Access-Token', tokens.accessToken);
                        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()==='production' });
                    }
                }catch(error){
                    req.user = null;
                    return next();
                } 
            } else {
                req.user = err ? null : decoded.user;
            }
            return next();
        });
    } else {
        req.user = null;
        return next();
    }
}