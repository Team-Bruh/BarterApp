const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const User = require('./models/user');
const bcrypt = require('bcrypt');

app.use(methodOverride('_method'));

require('dotenv').config();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());

//  MongoDB Connection
const mongoose_uri = process.env.ATLAS_URI;
mongoose.connect(mongoose_uri, {
   useNewUrlParser:true,
   useUnifiedTopology:true,
   useCreateIndex:true 
});

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('MongoDB Connection Successful!');
});

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.json());


// Allows Retrievel of Data from Url & Body
app.use(express.urlencoded({extended:false}));

app.get('/register', (req,res)=>{
    res.status(200).send();
});

app.post('/register', async (req,res)=>{

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

app.post('/login', (req,res)=>{ 
    
});

app.listen(3404, function(){
    console.log('Session started on port 3404');
});


