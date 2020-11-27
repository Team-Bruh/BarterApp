// This contains all routes pertaining to user authentication

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const Token = require('./../models/token');
const tokenAuthenticator = require('./../services/tokenAuthenticator');

router.get('/register', tokenAuthenticator.authenticate, (req,res)=>{           // gets registration form
    res.render('users/register');
});

router.post('/register', async (req,res)=>{        // backend registration process

    console.log(req.body.firstName);
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        let user = new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            address:req.body.address,
            contactNumber:req.body.contactNumber,
            email:req.body.email,
            password:hashedPassword,
            salt:salt
        });
        
        user = await user.save();
        res.status(200).send();
    }catch(er){
        console.log(er);
        res.status(400).send();
    }
});

router.get('/login', (req,res)=>{      // gets login form

    res.render('users/login');
});

router.post('/login', async (req,res)=>{           // backend login process
    let user = await User.findOne({email:req.body.email});
    if(user == null){
        return res.status(400).send('User not found');
    }

    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            const tokenPayload = {id:user.id};
            const accessToken = tokenAuthenticator.generate(tokenPayload, 'access');        // signs User with Access token
            const refreshToken = tokenAuthenticator.generate(tokenPayload, 'refresh');      // signs User with Refresh token 

            await tokenAuthenticator.storeRefreshToken(refreshToken);

            res.json({accessToken:accessToken, refreshToken:refreshToken});
        }else{
            res.status(200).send("Incorrect Password");
        }
    }catch(er){
        console.log(er);
        res.status(500).send();
    }

});

router.post('/token/refresh', (req, res) =>{        // refreshes JWT token
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    
    let token = Token.findOne({refreshToken:refreshToken});
    if(token != null){
        tokenAuthenticator.verifyRefreshToken(refreshToken, res);
    }else{
        return res.sendStatus(403);
    }
});

router.post('/token/delete', async (req,res) => {   // delete JWT refresh token
    await Token.findOneAndDelete({refreshToken:req.body.token});
    res.sendStatus(204);
});

module.exports = router;