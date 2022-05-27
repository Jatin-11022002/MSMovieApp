const router = require('express').Router();
require('dotenv').config();
const utility = require('../utility');
const recommend = require('../recommendation');
const jwt  = require('jsonwebtoken');
const pagesize = parseInt(process.env.PAGE_SIZE)
const tagpagesize = parseInt(process.env.TAG_PAGE_SIZE)
const JWT_SECRET = process.env.JWT_SECRET
router.get('/', async (req, res) => {
 

    return res.render('login',{
       
    })

})
module.exports =router;