const mongoose = require('mongoose');

const barterSessionSchema = new mongoose.Schema({

    host:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    targetItems:{
        type:String,
        required:true
    },
    bidders:[{
        userId:String,
        offer:String,
        biddedOn:Date
    }],
    createdOn:{
        type:Date,
        default:Date.now()
    },
    previousData:{
        type:String
    },
    lastModifiedOn:{
        type:Date
    },
    negotiationStartedOn:{
        type:Date
    },
    tradingPartner:{
        type:String
    },
    finalizedAddress:{
        type:String
    },
    negotiationFinalizedOn:{
        type:Date
    },
    completedOn:{
        type:Date
    },
    status:{
        type:String,
        required:true
    },
    hostRating:{
        rating:Number,
        timestamp:Date
    },
    partnerRating:{
        rating:Number,
        timestamp:Date
    }
});


module.exports = mongoose.model('BarterSessions', barterSessionSchema);