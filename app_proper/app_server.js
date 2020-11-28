const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
var path=require('path');

app.use(methodOverride('_method'));

require('dotenv').config();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());


// Routes
const authRoutes = require('./routes/route_auth');
const barterRoutes = require('./routes/route_barterHost');
const bidderRoutes = require('./routes/route_barterBidder');

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
app.use(express.static(path.join(__dirname,'/public/')));
app.use(express.json());


// Allows Retrievel of Data from Url & Body
app.use(express.urlencoded({extended:false}));
app.use('/', authRoutes);
app.use('/barter', barterRoutes);
app.use('/barter', bidderRoutes);
 
app.listen(3000, function(){
    console.log('Session started on port 3000');
});


