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

    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        let offer = {
            userId:req.user.id,
            offer:req.body.offer,
            biddedOn:Date.now()
        };

        barterSession.bidders.push(offer);
        await barterSession.save();

        res.send({barter:barterSession});

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }


});

router.post('/bidder/session/:id/negotiations/cancel', tokenAuthenticator.authenticate, async(req,res)=>{   // cancels ongoing negotiations of bidder
    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');


        barterSession.status = "BID";
        barterSession.negotiationStartedOn = null;
        barterSession.tradingPartner = null;
        barterSession.negotiationFinalizedOn = null;
        barterSession.finalizedAddress = null;

        await barterSession.save();
        res.status(200).send("Negotiations Cancelled");

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }
});

router.post('/bidder/session/:id/complete', tokenAuthenticator.authenticate, async(req,res)=>{      // completes the barter session (host rating is also prompted here)
    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        let hostRating = {
            rating:req.body.rating,
            timestamp:Date.now()
        };

        barterSession.hostRating = partnerRating;
        
        await barterSession.save();
        res.status(200).send("Successfully Completed Barter");
        

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }
});

 
module.exports = router; 