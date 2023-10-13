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

// app.use(async (req, res, next)=>{
    
//     const Personnel = require('./src/models/personnel.model')
    
//     req.isLogin = false
    
//     if(req.session?.id) {
//         const user =await Personnel.findOne({_id:req.session.id})
//         if(user.password == req.session.password){
//             req.isLogin = true
//         }
//     }
//     console.log('isLogin: ', req.isLogin)
//     next()
// } )

const jwt = require('jsonwebtoken')

app.use(async(req, res, next) =>{

    const auth = req.headers?.authorization || null
    const accessToken = auth ? auth.split(' ')[1] : null // JWT token'ı yakaladığımız yer

    jwt.verify(accessToken, process.env.SECRET_KEY, function(err, user){//access token'ı doğrulama. Secret_key ile çözümle. gelen cevabı da call back fonk'a göre çalıştır.
        if(err){
            req.user = null
            console.log('JWR Login: NO');
    } else{
        req.isLogin = true
        req.user= user.isActive ? user : null   //bunu yapmak zorunda değilim.auth controller'da denetledim. eğer token varsa func'ın ikinci paramtresi olan user'ı kullanıyorum. aldın aktifse kullan değilse salla
        console.log('JWT Login :YES');
    }
})
    next()

}) 
     



/* ------------------------------------------------------- */
//Routes
app.all('/',(req,res)=>{
    res.send({
        error:false,
        message:'Welcome To Personnel Api',
        session: req.session,
        isLogin:req.isLogin
    })
})

app.use('/auth', require('./src/routes/auth.router')),

//Departments
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