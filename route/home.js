const router = require('express').Router();
require('dotenv').config();
const utility = require('../utility');
const recommend = require('../recommendation');
const jwt  = require('jsonwebtoken');
const pagesize = parseInt(process.env.PAGE_SIZE)
const tagpagesize = parseInt(process.env.TAG_PAGE_SIZE)
const JWT_SECRET = process.env.JWT_SECRET
router.get('/home', async (req, res) => {
    var {
        token,
        page
    } = req.query;
    page = parseInt(page);
    let email = '';
   
    try {
    	const user = jwt.verify(token, JWT_SECRET);
        email  = user.email;
    }catch(error){
        console.log(error);
      return  res.json({ status: 'error', error: 'invalid user token' });
    }
    //fetch user data
    var userdata = await utility.fetchUserDetails(email);
    var newmovie = [];
    var count = await utility.fetchCount('m2m_movie_trends', 'tag');
    // filter new releases based on user country and  sort based on user preferences
    if (page == 1) {
        newmovie = await recommend.fetchNewMovies();
    }
    var usertags = JSON.parse(userdata.preferences);
    var tags = [];
  
    if ((parseInt((usertags.length - 1) / pagesize) + 1) === page) {
        var tagObj = usertags.slice(((page * pagesize) - pagesize), ((page * pagesize) - 1));
        tags.push(await recommend.fetchMovieByTags(tagObj));
    } else {
        var additonalParam = {
            'agegroup': userdata.agegroup,
            'usertags': usertags.toString()
        }
        var fetchOtherTags = [];
        fetchOtherTags = await recommend.fetchOtherTags(page - (parseInt((usertags.length - 1) / pagesize) + 1), additonalParam);
        if (fetchOtherTags.length > 0) {
            tags.push(await recommend.fetchMovieByTags(fetchOtherTags));
        }
    }


    return res.json({
        file: userdata,
        newmovies: newmovie,
        count: count,
        tags: tags,
        pagesize: pagesize,

    })

})
router.get('/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const {
        token
    } = req.query;
    let email = '';
   
    try {
    	const user = jwt.verify(token, JWT_SECRET);
        email  = user.email;
    }catch(error){
        console.log(error);
       return res.json({ status: 'error', error: 'invalid user token' });
    }
    //fetch user data
    var recommended = [];
    var userdata = await utility.fetchUserDetails(email);
    var movie = await utility.fetchMovie(id);
    var tags = await utility.fetchTagsByMovieID(id);
   
    var liked = !(userdata.likedMovie.indexOf(id) == -1);
    if (tags.length > 0) {
        recommended = await recommend.fetchRecommendedMovies(tags.toString(),id);
    }
    utility.UpdateUserPreferencesAndTrends(userdata, id, JSON.parse(userdata.preferences), tags);

    return res.json({
        movie: movie,
        'tags': tags,
        'recommend': recommended,
        liked: liked
    })
})
router.post('/movie/like', async (req, res) => {
    var {
        token,
        liked,
        movieId
    } = req.body;

    let email = '';
    try {
    	const user = jwt.verify(token, JWT_SECRET);
        email  = user.email;
    }catch(error){
        console.log(error);
        return res.json({ status: 'error', error: 'invalid user token' });
    }
    //fetch user data
    var userdata = await utility.fetchUserDetails(email);
    utility.updateLike(userdata, liked, movieId);


    return res.json({
        status: 'success',
    })
})
router.get('/', async (req, res) => {
    
    return res.render('movies',{
        status: 'success',
    })
})

module.exports = router;