// This handles all JWT token functions

const Token = require('./../models/token');
const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
       if(err){
           return res.sendStatus(403);
       }

       req.user = user;
       next();

    });

}

function verifyRefreshToken(token, res){
 
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403);
        const newAccessToken = generateToken({id:user.id}, 'access');
        return res.json({accessToken:newAccessToken});
    });
    
}

function generateToken(payload, type){

    if(type == "access"){
        let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'900s'})
        return token;
    }else{
        let token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
        return token;
    }
}

async function saveRefreshToken (token){
    let _refreshToken = new Token({
        refreshToken:token
    });

    await _refreshToken.save();
}

const tokenAuthenticator = {
    authenticate:authenticateToken, 
    generate:generateToken,
    storeRefreshToken:saveRefreshToken,
    verifyRefreshToken:verifyRefreshToken
};

module.exports = tokenAuthenticator;