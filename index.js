"use strict"

/*
    $ npm i express dotenv mongoose express-async-errors
    $ npm i cookie-session
    $ npm i jsonwebtoken
*/

const express = require('express')
const app = express()


/* ------------------------------------------------------- */
//Required Modules:
require('dotenv').config()
const PORT = process.env?.PORT || 8000

require('express-async-errors')


/* ------------------------------------------------------- */
//Configurations
const {dbConnection} = require('./src/configs/dbConnection')
dbConnection() //-------------------------------------------> yukarıda destructure yaptık çağırdık ancak burda da aktif ediyoruz. 


/* ------------------------------------------------------- */
//Middlewares
app.use(express.json()) //----------------------------------> gelen veriyi almak ve objeye çevirmek için express json kullanıyoruz

app.use(require('cookie-session')({secret: process.env.SECRET_KEY}))

app.use(require('./src/middlewares/findSearchSortPage'))


/* ------------------------------------------------------- */
//Routes
app.all('/',(req,res)=>{
    res.send({
        error:false,
        message:'Welcome To Personnel Api',
    })
})

app.use('/departments', require('./src/routes/department.router'))

app.use('/personnels', require('./src/routes/personnel.router'))

/* ------------------------------------------------------- */
// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))


/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')()