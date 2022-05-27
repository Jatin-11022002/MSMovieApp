const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const db = require('./config/db');
db.connectDB();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(cors({
    origin: '*'
}));
 app.use('/movies/newmovie', require('./route/newmovie'));
 app.use('/movies/auth', require('./route/auth'));
 app.use('/movies/search/', require('./route/search'));
 app.use('/movies/',require('./route/home'));



app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})