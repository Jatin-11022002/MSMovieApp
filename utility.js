const sql = require('mssql');
module.exports = {
    checkIfTagExist: async function (tag) {
        try {
            var query = `select tag from trends where tag = '${tag}'`;
            var result = await sql.query(query);
            if (result.recordset.length > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    },
    fetchUserDetails: async function (email) {
        try{
            var query = `select * from users where email = '${email}'`;
            var result = await sql.query(query);
            if(result.recordset.length>0)
            {
                return result.recordset[0];
            }
        }catch(error)
        {
            console.log(error);
        }
    },
    fetchMovie: async function (id){
        try {
            var query =  `SELECT *
            FROM movie where id = '${id}' `
            var result = await sql.query(query);
            if(result.recordset.length>0)
            {
                return result.recordset[0];
            }
        }catch(error)
        {
            console.log(error);
        }
    },
    fetchTagsByMovieID: async function(id){
       var map =[]
        try {
            var query =  `SELECT tag
            FROM m2m_movie_trends where  movieid =  '${id}' `
            var result = await sql.query(query);
            if(result.recordset.length>0)
            {
                map =  result.recordset.map((obj)=>obj.tag);
                
            }
            return map;
        }catch(error)
        {
            console.log(error);
        }
    },
    UpdateUserPreferencesAndTrends:  function(userdata,movieID, preferences,newPreferences){
       var tagStr = [];
       var {email} = userdata;
       
    for(var i in newPreferences){
       preferences =  this.lru(preferences,newPreferences[i]);
       tagStr.push("'"+newPreferences[i]+"'");
    }
    
    try {
        //updating user preference
        var userQuery = `Update users set preferences = '${JSON.stringify(preferences)}' where email = '${email}'`
         sql.query(userQuery);
         
         var movieQuery = `Update movie set watched= watched +1 where id = '${movieID}'`
         sql.query(movieQuery);
         if(tagStr.length>0){
         var trendsQuery = `Update trends set hits = hits+1 where tag in (${tagStr.toString()}) `
      
         sql.query(trendsQuery);}
        
        
    } catch (error) {
        console.log(error);
    }


    
    },
    lru(preferences,value){
        var getI =preferences.indexOf(value)
        if(getI!== -1){
            
            preferences.splice(getI,1);
            preferences.unshift(value);
        }if(getI === -1){
            preferences.unshift(value);
            if(preferences.length > 3){
                preferences.pop();
        }
        }
        return preferences;
    },
    fetchMovieBYMovieNames: async function(value){
        try {
            var query =  `SELECT *
            FROM movie where name = '${value}' `
            var result = await sql.query(query);
            if(result.recordset.length>0)
            {
                return result.recordset[0];
            }
        }catch(error)
        {
            console.log(error);
        }
    },
    fetchCount: async function(table ,column ,clause){
    try {
        var query = `SELECT count(${column}) as total
        FROM ${table} ${clause} `
        var result = await sql.query(query);
        if(result.recordset.length>0)
        {
            return result.recordset[0].total;
        }
    } catch (error) {
        
    }

},
    updateLike: function(userdata,liked,movieID){

        var {email,likedMovie} = userdata;
       likedMovie = JSON.parse(likedMovie);
       if(liked && likedMovie.indexOf(movieID) == -1)
       {
        likedMovie.push(movieID);
        }else if(!liked && likedMovie.indexOf(movieID) !== -1){
            likedMovie.splice(likedMovie.indexOf(movieID),1);
        }
        try {
            //updating user preference
            var userQuery = `Update users set likedMovie = '${JSON.stringify(likedMovie)}'  where email = '${email}'`
             sql.query(userQuery);
             
             var movieQuery = `Update movie set ${(liked)?'liked =liked+1':'liked =liked-1'} where id = '${movieID}'`
             sql.query(movieQuery);
           
            
        } catch (error) {
            console.log(error);
        }
    }
}