const express = require('express');
const router = express.Router();
const BarterSession = require('../models/barterSession');
const tokenAuthenticator = require('../services/tokenAuthenticator');


// Barter Session Bidder

router.get('/bidder/session/:id', tokenAuthenticator.authenticate, async(req,res)=>{        // gets bidder view of barter session

    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        res.send({barter:barterSession})
       

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }

});
 
router.post('/bidder/session/:id/bid', tokenAuthenticator.authenticate, async(req,res)=>{   // posts bidder's offer for barter session

});

router.post('/bidder/session/:id/negotiations/cancel', tokenAuthenticator.authenticate, async(req,res)=>{   // cancels ongoing negotiations of bidder

});

router.post('/bidder/session/:id/complete', tokenAuthenticator.authenticate, async(req,res)=>{      // completes the barter session (host rating is also prompted here)

});


module.exports = router; 