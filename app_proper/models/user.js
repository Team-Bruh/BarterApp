const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now()
    },
    address:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    lastModifiedOn:{
        type:Date,
        required:false
    },
    previousData:{
        type:String,
        required:false
    },
    reputation:{
        type:Number,
        required:false,
        default:0
    },
    salt:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('User', userSchema);