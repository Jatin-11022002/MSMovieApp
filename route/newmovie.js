const multer = require('multer');
const express = require('express');
const app = express();
const router = require('express').Router();
const path = require('path');
const sql = require('mssql');
const utility = require('../utility');
const {
    v4: uuid4
} = require('uuid');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'upload/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)} ${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    }

})

let upload = multer({
    storage: storage,
    limit: {
        fileSize: 1000000 * 100
    },
}).single('movie');

router.post("/", (req, res) => {
   
    //store file
    upload(req, res, async (err) => {
        //validating req
      
        if (!req.file) {
            return res.json({
                error: 'their is an error'
            });
        }
        if (err) {
            return res.status(500).send({
                error: err.message
            })
        }
       
        let data = JSON.parse(req.body.data);
        let uuid = uuid4();
        try {

            //insert movie
            var query = `Insert into movie(id,name,release_date,genre,country,path,overview) Values ('${uuid}','${data.name}','${data.release_date}','${data.genre}','${data.country}','\\${req.file.path}','${data.overview}')`;
            await sql.query(query);
            //insert tags

            var tags = (data.tags);


            for (var tag in tags) {
               
                //check if the tag exist or not
                var exist = await utility.checkIfTagExist(tags[tag]);
               
                if (!exist) {
                    query = `Insert into trends(tag) Values ('${tags[tag]}')`
                    await sql.query(query);
                }
                // insert into m2m(many to many relationship) table
                query = `Insert into m2m_movie_trends(movieid,tag) Values ('${uuid}','${tags[tag]}')`;
                await sql.query(query);

            }
        } catch (error) {
            console.log(error)
            // duplicate key
            return res.json({
                status: 'error',
                error: 'cannot add new movie'
            })
        }


        return res.json({
            status: 'success',
            message: 'movie added'
        })
    })
})

module.exports = router;