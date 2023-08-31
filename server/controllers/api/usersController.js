const encService = require('../../services/encryptionService');
const tokenService = require('../../services/tokenService');
const User = require('../../models/user');

async function create(req, res) {
    // sign user up and return tokens
    try {
        const user = await User.create(req.body);
        const accessToken = tokenService.createJWT(user, process.env.TOKEN_EXP);
        const refreshToken = await tokenService.createRefreshToken(user);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()==='production' });
        res.json({ accessToken });
    } catch (error) {
        res.status(400).json(error);
    }
}
async function login(req, res) {
    // log user in and return tokens
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user || ! (await encService.compare(password,user.password))){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = tokenService.createJWT(user, process.env.TOKEN_EXP);
        const refreshToken = await tokenService.createRefreshToken(user);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()==='production'  });
        res.json({ accessToken });
    } catch (error) {
        res.status(400).json(error);
    }
}

async function refresh(req, res) {
    // return status of refresh token
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken)
            res.status(400).json({message:'No token'});
        const status = await tokenService.getTokenStatus(refreshToken);
        if(status !== 'OK'){
            return res.status(400).json({message: status});
        }
        return res.status(200).json({message: status});
    } catch (error) {
        res.status(400).json(error);
    }
}

async function logout(req, res) {
    // delete a refresh token belonging to user if data is valid
    try {
        const refreshToken = req.cookies.refreshToken;
        await tokenService.delete(refreshToken);
        res.clearCookie('refreshToken');
        res.json({message: 'Logged out successfully'});
    } catch (error) {
        res.status(400).json(error);
    }
}



module.exports = {
    create,
    login,
    logout,
    refresh,
}