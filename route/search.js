const router = require('express').Router();
require('dotenv').config();
const utility = require('../utility');
const recommend = require('../recommendation');
const jwt  = require('jsonwebtoken');
const pagesize = parseInt(process.env.PAGE_SIZE)
const tagpagesize = parseInt(process.env.TAG_PAGE_SIZE)
const JWT_SECRET = process.env.JWT_SECRET
router.get('/', async (req, res) => {
    const {
        token,
        entity,
        value
    } = req.query;
    const page  = parseInt(req.query.page);
    let email = '';
    try {
    	const user = jwt.verify(token, JWT_SECRET);
        email  = user.email;
    }catch(error){
        console.log(error);
        res.json({ status: 'error', error: 'invalid user token' });
    }
    //fetch user data
    var clause= '';
    var count =0;
    if (entity === 'tags') {
        clause = `trends.tag LIKE '%${value}%'`
        var movies = await recommend.fetchMoviesByEntity(clause, page);
        count = await utility.fetchCount('m2m_movie_trends','tag',`where tag LIKE '%${value}%'`)
        return res.json({
            status:'success',
            value:value,
            movies: movies,
            count:count,
            tagpagesize:tagpagesize
        })
    } else if (entity === 'movies') {
        clause = `movie.name LIKE '%${value}%'`
        count = await utility.fetchCount('movie','name',`where name LIKE '%${value}%'`)
        movies = await recommend.fetchMoviesByEntity(clause, page);
        return res.json({
            status:'success',
            value: value,
            movies: movies,
            count:count,
            tagpagesize:tagpagesize
        })
       
    }


    return res.json({
        status: 'error',
        'errorMessage': 'No record found',
    })

})
router.get('/:entity/:value', async (req, res) => {
    const {
        entity,
        value
    } = req.params;
    
    var clause= '';
    var count =0;
    if (entity === 'tags') {
        clause = `tag LIKE '%${value}%'`
        var tags = await recommend.fetchEntityByName(clause);
        return res.json({
            status:'success',
            value:value,
            tags: tags,
        })
    } 


    return res.json({
        status: 'error',
        'errorMessage': 'No record found',
    })

})
module.exports =router