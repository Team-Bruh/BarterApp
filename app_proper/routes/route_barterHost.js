const express = require('express');
const router = express.Router();
const tokenAuthenticator = require('../services/tokenAuthenticator');
const BarterSession = require('../models/barterSession');

// Barter Session Host

router.post('/new', tokenAuthenticator.authenticate, async (req,res)=>{   // posts new barter session
    
    try{
        let barterSession = new BarterSession({
            host:req.user.id,
            description:req.body.description,
            targetItems:req.body.targetItems,
            address:req.body.address,
            status:"BID"
        }); 

        await barterSession.save();
        res.sendStatus(200);

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }

});

router.get('/host/session/:id', tokenAuthenticator.authenticate, async (req, res) =>{  // gets existing barter session

    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        if(barterSession.host === req.user.id){
            res.send({barter:barterSession})
        }else{
            res.status(401).send('Invalid Host');
        }

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }

});

router.put('/host/session/:id/edit' /*, tokenAuthenticator.authenticate */, async(req,res)=>{   // updates existing barter session

    /*try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        if(barterSession.host === req.user.id){

            let _previousBarterSession = {
                description:barterSession.description,
                targetItems:barterSession.targetItems,
                address:barterSession.address
            };
            barterSession.previousData = JSON.stringify(_previousBarterSession);
            barterSession.description = req.body.description;
            barterSession.targetItems = req.body.targetItems;
            barterSession.address = req.body.address;
            barterSession.lastModifiedOn = Date.now();

            await barterSession.save();
            res.send({barter:barterSession})
        }else{
            res.status(401).send('Invalid Host');
        }

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }
    */
    return res.render('barter/productHost.ejs');

});

router.put('/host/session/:id/offer/take', tokenAuthenticator.authenticate, async(req,res)=>{  // takes offer and sends barter session into negotiation stage
    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        if(barterSession.host === req.user.id){

            barterSession.status = "NEGOTIATION";
            barterSession.negotiationStartedOn = Date.now();
            barterSession.tradingPartner = req.body.tradingPartner;

            await barterSession.save();
            res.status(200).send("Negotiations Started, Open Chat");
            
        }else{
            res.status(401).send('Invalid Host');
        }

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }

});

router.put('/host/session/:id/offer/decline', tokenAuthenticator.authenticate, async(req,res)=>{ // removes bidder from barter session's bidding
    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        if(barterSession.host === req.user.id){

            let bidders = barterSession.bidders;
            bidders = bidders.filter(x=>x.userId != req.params.bidder);

            barterSession.bidders = bidders;

            await barterSession.save();
            res.status(200).send("Successfully Removed Bidder");
            
        }else{
            res.status(401).send('Invalid Host');
        }

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }
});

router.delete('/host/session/:id/negotiations/cancel', tokenAuthenticator.authenticate, async(req,res)=>{  // cancels negotiations and sends barter session back to bidding stage
    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        if(barterSession.host === req.user.id){

            barterSession.status = "BID";
            barterSession.negotiationStartedOn = null;
            barterSession.tradingPartner = null;
            barterSession.negotiationFinalizedOn = null;
            barterSession.finalizedAddress = null;

            await barterSession.save();
            res.status(200).send("Negotiations Cancelled");
            
        }else{
            res.status(401).send('Invalid Host');
        }

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }
});

router.put('/host/session/:id/negotiations/finalize', tokenAuthenticator.authenticate, async(req,res)=>{     // finalizes negotations and sens barter session to pending stage
    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        if(barterSession.host === req.user.id){

            barterSession.finalizedAddress = req.params.address;
            barterSession.status = "PENDING";
            barterSession.negotiationFinalizedOn = Date.now();
            
            await barterSession.save();
            res.status(200).send("Successfully Finalized Negotiations, Ready For Completion");
            
        }else{
            res.status(401).send('Invalid Host');
        }

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }
});

router.put('/host/session/:id/complete', tokenAuthenticator.authenticate, async (req,res)=>{ // completes the barter session
    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        if(barterSession.host === req.user.id){

            let partnerRating = {
                rating:req.body.rating,
                timestamp:Date.now()
            };

            barterSession.partnerRating = partnerRating;
            barterSession.status = "COMPLETED";
            barterSession.completedOn = Date.now();
            
            await barterSession.save();
            res.status(200).send("Successfully Finalized Negotiations, Ready For Finalization");
            
        }else{
            res.status(401).send('Invalid Host');
        }

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }
});

router.delete('/host/session/:id', tokenAuthenticator.authenticate, async(req,res)=>{    // deletes the barter session
    try{

        let barterSession = await BarterSession.findById(req.params.id);

        if(barterSession == null) return res.status(200).send('Barter Not Found');

        if(barterSession.host === req.user.id){

            barterSession = null;
            res.status(200).send("Successfully Delete Barter Session");
            
        }else{
            res.status(401).send('Invalid Host');
        }

    }catch(er){
        console.log(er);
        res.sendStatus(400);
    }
});



module.exports = router;

