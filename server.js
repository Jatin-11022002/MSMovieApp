const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./config/db');
db.connectDB();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(cors({
    origin: '*'
}));

app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.static('public'));
 app.use('/movies/newmovie', require('./route/newmovie'));
 app.use('/movies/auth', require('./route/auth'));
 app.use('/movies/search/', require('./route/search'));
 app.use('/movies/',require('./route/home'));
 app.use('/',require('./route/default'));


app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})