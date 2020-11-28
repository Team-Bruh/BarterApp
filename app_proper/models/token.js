const { data } = require('autoprefixer');
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    refreshToken:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("RefreshTokens", tokenSchema);