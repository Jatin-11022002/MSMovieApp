const router = require('express').Router();
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const sql = require('mssql');
const jwt  = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET
router.get('/login', async (req, res) => {
	let user = {};
	const { email, password } = req.query;
	
	try {
        let query =  `select email , password from users where email = '${email}'`;
       	console.log(query);
    	 const result =  await sql.query(query);
		 user =result.recordset[0];
	} catch (error) {
		console.log(error);
		throw error;
	}
	
	if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the email, password combination is successful

		const token = jwt.sign(
			{
				email: user.email
			},
			JWT_SECRET
		)

		return res.json({ status: 'success', token: token })
	}

	res.json({ status: 'error', error: 'Invalid email/password' })
});
router.post('/signup', async (req, res) => {
   
    const userdata = req.body.userdata;
    
	const email =  userdata.email;
    const plainTextPassword = userdata.password;
	
	if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
        let query = `Insert into users (email,password,preferences,agegroup) Values ('${email}','${password}','${JSON.stringify(userdata.preferences)}','${userdata.agegroup}')`;
       console.log(query);
      await sql.query(query);
	  return res.json({ status: 'success', message: 'User registered' })
      
	} catch (error) {
		if (error.number == 2627) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})
module.exports = router