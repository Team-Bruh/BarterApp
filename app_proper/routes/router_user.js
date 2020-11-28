const express = require('express');
const router = express.Router();
const BarterSession = require('./../models/barterSession');
const tokenAuthenticator = require('./../services/tokenAuthenticator');


