const sql = require('mssql');
require('dotenv').config();
const pagesize = parseInt(process.env.PAGE_SIZE);
const tagpagesize = parseInt(process.env.TAG_PAGE_SIZE);
module.exports = {
    fetchNewMovies: async function () {
        var query = `select top(5) * from movie order by release_date desc, liked desc `;
        try {
            var result = await sql.query(query);
            if (result.recordset.length > 0) {
                return result.recordset;
            }

        } catch (error) {
            console.log(error);
        }

    },
    fetchMovieByTags: async function (tags) {

        var map = {};
        try {
            for (var tag in tags) {
                var query = `select top(5) * from m2m_movie_trends , trends, movie where m2m_movie_trends.movieid = movie.id and m2m_movie_trends.tag = trends.tag and trends.tag = '${tags[tag]}' `
                result = await sql.query(query);
                if (result.recordset.length > 0) {
                    map[tags[tag]] = result.recordset;
                }
            }
            return map;

        } catch (error) {
            console.log(error);
        }

    },
    fetchOtherTags:async function(page,additonalParam){
var orderBy = `agegroup_${additonalParam.agegroup} desc`;
var map =[];
var tagStr = [];
var usertags = additonalParam.usertags.split(',');
for(var i in usertags){
    tagStr.push("'"+usertags[i]+"'");
}
        try{
            var query = `select tag from(SELECT top(1000)
            ROW_NUMBER() over(order by tag)rownumber,tag
        FROM trends where tag NOT IN (${tagStr.toString()}) order by ${orderBy},hits desc)t where rownumber between ${((page*pagesize)-pagesize)+1} and ${(page*pagesize)}`
        
        console.log(query);
        var result = await sql.query(query);
        if(result.recordset.length>0)
        { 
            map = result.recordset.map((tag)=>tag.tag)
           
           
        }
        return map;
        }catch(error){

        }
    },

    fetchRecommendedMovies:async function(tags,movieid){
 var map = [];
 var tagStr = [];
var usertags = tags.split(',');
for(var i in usertags){
    tagStr.push("'"+usertags[i]+"'");
}
        try {
            
                var query = `SELECT  id ,name ,release_date ,genre,country, path , liked,overview
                FROM(SELECT distinct id ,name ,release_date ,genre,country, path , liked,overview,hits from trends ,movie ,m2m_movie_trends where m2m_movie_trends.movieid = movie.id and m2m_movie_trends.tag =trends.tag and movie.id!= '${movieid}'  and trends.tag in (${tagStr.toString()}) )as t order by hits desc ,liked desc offset 0  rows fetch next 5 rows only`
                
  
                result = await sql.query(query);
                if (result.recordset.length > 0) {
                   
                   map.push(result.recordset);
                
            }
            return map;

        } catch (error) {
            console.log(error);
        }
    },
    fetchMoviesByEntity:async function (clause,page){
      
      var map=[];
        try{  var query = `SELECT distinct movieid ,name,path,liked,watched ,overview
        FROM trends ,m2m_movie_trends,movie where m2m_movie_trends.movieid = movie.id and m2m_movie_trends.tag = trends.tag and ${clause} order by liked desc,watched desc offset ${(page*tagpagesize)-tagpagesize} rows fetch next ${page*tagpagesize-1} rows only`
      var result = await sql.query(query);
      if(result.recordset.length>0)
      { 
          map = result.recordset;
      }
      return map;
    }catch(error)
    {
        console.log(error);
    }
    },
    fetchEntityByName:async function (clause){
      
        var map=[];
          try{  var query = `SELECT TOP(5) tag
          FROM trends where ${clause} order by hits desc `
        var result = await sql.query(query);
        if(result.recordset.length>0)
        { 
            map = result.recordset.map((tag)=>tag.tag);
        }
        return map;
      }catch(error)
      {
          console.log(error);
      }
      }
}