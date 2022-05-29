# MSMovieApp
MSMovieApp runs on localhost 
so BY default  website is configured for http://localhost:3000
#To start the server and resolve nodejs dependency
1.Execute this command
 yarn install
 npm start
2. Port , host url changes if not on localhost, if using localhost plese verify these changes
if port or host needs to changed then needfull changes are:-
FileName                   changes in file
.env                      APP_BASE_URL , PORT
public/js/login.js        BASE_URL
public/js/movies.js      BASE_URL

## MSSQL server database is Used which is hosted on azure
after doing "npm start or node server.js " if unable to see "db connected" log on console please add your client ip in the azure databse firewall rules
azure credential if client is unable to access
url: https://portal.azure.com/
email: jatinramchandani15@gmail.com
password: Challenger@20072002
dbname: msmoviedb

after doing needful changes do "npm start"

## Website Entry point
 Entry point for website is
 http://localhost:3000/
 
 
## IF new data need to be added
Method : POST
API :  {<host>:<PORT>}/movies/newmovie
BODY:  
data: { {
	"name":“movie name",
	"release_date": “yyyy-mm-dd",
	"genre": “genre",
	"country":“country name",
	"overview":“xyz.",
	"tags":[“tag1",“tag2",“tag3",“tag4",“tag5"]
	} }
movie: <select files>
Note:-
 format of body need to be strictly followed,
Any escape character used while adding data requires ‘\’ for API to accept it
![image](https://user-images.githubusercontent.com/92532559/170766355-4afcb7dd-a94f-449e-8b34-ee23561658a2.png)
![image](https://user-images.githubusercontent.com/92532559/170766421-7d90c9fc-0f8e-48e8-8e9f-6faa71892d88.png)

