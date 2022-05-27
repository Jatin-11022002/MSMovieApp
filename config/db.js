require('dotenv').config();
const sql = require('mssql');
const sqlConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  server: process.env.SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}
// const sqlConfig = {
//   authentication: {
//     options: {
//       user: "movieadmin", // update me
//       password: "movie*123" // update me
//     },
//     type: "default"
//   },
//   server: "msmoviedb.database.windows.net", // update me
//   options: {
//     database: "msmoviedb", //update me
//     encrypt: true
//   }
// };
module.exports  = {
connectDB : async function (){
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig)
   // const result = await sql.query `select * from student`
    console.log("db connected")
  } catch (err) {
    // ... error checks
    console.log(err);
  }

}

}
