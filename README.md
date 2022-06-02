# MSMovieApp
MSMovieApp runs on localhost <br/>
so BY default  website is configured for http://localhost:3000 <br/>
# To start the server and resolve nodejs dependency
- Execute this command
 	- yarn install
 	- npm start
-  Port , host url changes if not on localhost, if using localhost plese verify these changes
if port or host needs to changed then needfull changes are:-

| FileName            | changes in file     |
| ------------------- | ------------------- |
| .env        	      | APP_BASE_URL , PORT |
| public/js/login.js  |  BASE_URL           |
| public/js/movies.js |  BASE_URL           |
## ---------------------------------- Database Setup -------------------------------------
## MSSQL server database is Used which is hosted on azure
- after doing "npm start or node server.js " if unable to see "db connected" log on console please add your client ip in the azure databse firewall rules
- azure credential if client is unable to access
	-  url: https://portal.azure.com/
	-  email: jatinramchandani15@gmail.com
	-  password: Challenger@20072002
	-  dbname: msmoviedb

- after doing needful changes do "npm start"
## OR
## If azure services are expired due to credits on azure service ended (student account - 25% left updated on 2-june)
- Then please setup a local sql server
- Update  user ,password ,server details in ".env" file .
- import "msmoviedb.bacpac"(avalaible in source code) file into the local setup.
- Follow following details to import
	- Navigate to local database setup 
	- right click on databases and import as data-tier application
	- choose "msmoviedb.bacpac" and do next and finish 
	- and database is ready
- after doing needful changes do "npm start"
## -------------------------------- Database setup end ------------------------------
## Website Entry point
 Entry point for website is
 	- http://localhost:3000/
 
 
## IF new data need to be added
- Method : POST
- API :  `http://<host>:<port>/movies/newmovie`
- BODY:  data: { { <br/>
	"name":“movie name", <br/>
	"release_date": “yyyy-mm-dd", <br/>
	"genre": “genre", <br/>
	"country":“country name",<br/>
	"overview":“xyz.", <br/>

	"tags":[“tag1",“tag2",“tag3",“tag4",“tag5"] 
	} } <br/>
	movie: `<select files>` <br/>
Note:- <br/>
 format of body need to be strictly followed,<br/>
Any escape character used while adding data requires ‘\’ for API to accept it <br/>

![image](https://user-images.githubusercontent.com/92532559/170766421-7d90c9fc-0f8e-48e8-8e9f-6faa71892d88.png)
![Screenshot (324)](https://user-images.githubusercontent.com/92532559/170857492-62582b0d-c2ee-4d52-a9b7-11dc28e91286.png)

