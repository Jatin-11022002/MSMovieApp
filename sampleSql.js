const sql = require('mssql')
const sqlConfig = {
  user: "sa",
  password: "jatin",
  database: "sample",
  server: 'localhost',
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

async function getConn() {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig)
    const result = await sql.query `select * from student`
    console.log(result)
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

getConn();