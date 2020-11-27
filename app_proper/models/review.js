const mongoose =  require('mongoose');


const reviewSchema = new mongoose.Schema({
    reviewedBy:{
        type:String
    },
    comment:{
        type:String
    },
    rating:{
        type:Number
    },
    barterSessionId:{
        type:String
    },
    createdOn:{
        type:Date
    }
});


module.exports = mongoose.model("Reviews", reviewSchema);